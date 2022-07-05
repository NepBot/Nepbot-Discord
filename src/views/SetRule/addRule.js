import React,{useState} from 'react';
import {useHistory} from 'react-router-dom'
import {Modal, Form, Input, Button, Select, Space} from "antd";
import {connect, WalletConnection} from "near-api-js";
import {getConfig} from "../../config";
import {signRule} from "../../api/api";
import {contract, parseAmount, sign} from "../../utils/util";
import store from "../../store/discordInfo";
import { requestTransaction } from '../../utils/contract';

const config = getConfig()

const { Item } = Form;
const { Option } = Select;
function AddRule(props) {
    const [form] = Form.useForm();
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [type, setType] = useState('');
    const [isParas, setParas] = useState(false)
    const history = useHistory()
    // const [checkNick, setCheckNick] = useState(false);
    const onFinish = async (values) => {
        console.log('Success:', values);

        const _near = await connect(config);
        const _wallet = new WalletConnection(_near,1);
        const account = await _wallet.account();
        const rule = await account.viewFunction(config.RULE_CONTRACT,'get_guild', {guild_id: props.server.id});
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    const onCheck = async () => {
        try {
            const values = await form.validateFields();
            let arg = {
                guild_id: props.server.id,
                role_id: values.role_id,
            }
            setConfirmLoading(true);
            const near = await connect(config);
            const wallet = new WalletConnection(near,"nepbot");
            const account = wallet.account()
            if (type == 'token amount') {
                let metadata = await account.viewFunction(values.token_id, 'ft_metadata', {})
                let amount = parseAmount(values.token_amount, metadata.decimals)
                arg.key_field = ['token_id', values.token_id]
                arg.fields = {token_amount: amount}
            } else if (type == 'oct roles') {
                arg.key_field = ['appchain_id', values.appchain_id]
                arg.fields = {oct_role: values.oct_role}
            } else if (type == 'near balance') {
                arg.key_field = ['near', 'balance']
                arg.fields = {balance: parseAmount(values.balance)}
            } else if (type == 'nft amount') {
                if (values.contract_id == config.PARAS_CONTRACT) {
                    const fractions = values.collection_url.split("/")
                    const lastFraction = fractions[fractions.length - 1].split("?")
                    arg.key_field = [config.PARAS_CONTRACT, lastFraction[0]]
                    arg.fields = {token_amount: values.token_amount}
                } else {
                    await account.viewFunction(values.contract_id, 'nft_metadata', {})
                    arg.key_field = ['nft_contract_id', values.contract_id]
                    arg.fields = {token_amount: values.token_amount}
                }
            }
            const params = store.get("info")
            const operationSign = store.get("operationSign")
            const args = {
                sign: operationSign,
                user_id: params.user_id,
                guild_id: params.guild_id,
            }
            
            const msg = {
                args: args,
                sign: await sign(account, args),
                account_id: account.accountId
            }
            const _sign = await signRule(msg);
            if (!_sign) {
                history.push({pathname: '/linkexpired', })
                return
            }
            const data = await requestTransaction(
                account,
                config.RULE_CONTRACT,
                'set_roles',
                 {roles: [arg], ..._sign},
                '300000000000000',
                '20000000000000000000000',
            )
            setTimeout(()=>{
                if(data){
                    setConfirmLoading(false);
                    form.resetFields();
                    props.onOk();
                }
            })
        } catch (errorInfo) {
            setConfirmLoading(false);
            console.log('Failed:', errorInfo);
        }
    };
    const handleChangeType = async (v) => {
        setType(v);
    }
    const handleInputChange = async (v) => {
        setParas(v.target.value == config.PARAS_CONTRACT)
    }

    const onSearch = (e) => {
        console.log(e,'-----');
    }
    
    const roleList = props.roleList.map(item => 
        <Option value={item.id} key={item.id}>{item.name}</Option>
    );


    function TypeDetail(){
        if(type === 'token amount'){
            return <Token />;
        }else if(type === 'oct roles'){
            return <OctRoles />
        }else if(type === 'near balance'){
            return <Balance />
        }else if(type === 'nft amount'){
            return <NftAmount />
        }else {
            return <div/>
        }
    }
    
    function Token(){
        return <div>
            <Item
            label="token address"
            name="token_id"
            rules={[{ required: true, message: 'Enter a token address' }]}
            >
                <Input bordered={false}/>
            </Item>
            <Item
                label="token amount"
                name="token_amount"
                rules={[{ required: true, message: 'Enter a token amount' }]}
            >
                <Input bordered={false}/>
            </Item>
        </div>
    }
    
    function OctRoles(){
        const appchainIds = props.appchainIds.map(item => 
            <Option value={item} key={item}>{item}</Option>
        );
        return <div>
            
            <Item
                label="appchain id"
                name="appchain_id"
                rules={[{ required: true, message: 'Please choose a appchain' }]}
            >
                <Select dropdownClassName={"dropdown"}>
                    {appchainIds}
                </Select>
            </Item>
            <Item
                label="oct role"
                name="oct_role"
                rules={[{ required: true, message: 'Please choose an oct role' }]}
            >
                <Select dropdownClassName={"dropdown"}>
                    <Option value='delegator'>delegator</Option>
                    <Option value='validator'>validator</Option>
                </Select>
            </Item>
    
        </div>
    }
    
    function Balance(){
        return <div>
            <Item
            label="balance"
            name="balance"
            rules={[{ required: true, message: 'Enter a balance' }]}
            >
                <Input bordered={false}/>
            </Item>
        </div>
    }
    
    function NftAmount(){
        
        return <div>
            
            <Item
                label="nft contract id"
                name="contract_id"
                rules={[{ required: true, message: 'Please input contract id' }]}
            >
                <Input bordered={false} onChange={(v) => {handleInputChange(v)}}/>
            </Item>
            <div className={['collection-url', (isParas) ? 'show' : ''].join(' ')}>
                <Item
                    label="collection url"
                    name="collection_url"
                    rules={[{ required: false, message: 'Please input collection id' }]}
                    hidden={!isParas}
                >
                    <Input bordered={false} />
                </Item>
            </div>
            <Item
                label="amount"
                name="token_amount"
                rules={[{ required: true, message: 'Please input amount' }]}
            >
                <Input bordered={false} />
            </Item>
    
        </div>
    }

    return (
        <div className={'modal-box'}>
            <Modal title="Add Rule" wrapClassName="rule-modal" maskClosable={false}  visible={props.visible} onOk={props.onOk}
                footer={[
                    <Button key="back" onClick={()=>{ form.resetFields();props.onCancel(); }}>
                        cancel
                    </Button>,
                    <Button loading={confirmLoading}  key="submit" htmlType="submit" type="primary" onClick={onCheck}>
                        ok
                    </Button>
                ]} 
                onCancel={props.onCancel}
                >
                <Form
                    form={form}
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 14 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    {/* <Item
                        label="server name"
                        name="guild_id"
                        rules={[{ required: true, message: 'Please choose a server' }]}
                    >
                        <Select>
                            <Option value={server.id}>{server.name}</Option>
                        </Select>
                    </Item> */}
                    <Item
                        label="role"
                        name="role_id"
                        rules={[{ required: true, message: 'Please choose a role' }]}
                    >
                        <Select allowClear showSearch optionFilterProp="children" onSearch={onSearch} dropdownClassName={"dropdown"}>
                            {roleList}
                        </Select>
                    </Item>
                    <Item
                        label="type"
                        name="type"
                        rules={[{ required: true, message: 'Please choose a type' }]}
                    >
                        <Select dropdownClassName={"dropdown"} onChange={(v)=>{handleChangeType(v)}}>
                            <Option value='token amount'>Token amount</Option>
                            <Option value='oct roles'>OCT roles</Option>
                            <Option value='near balance'>Near balance</Option>
                            <Option value='nft amount'>NFT</Option>
                        </Select>
                    </Item>
                    <TypeDetail type={type} appchainIds={props.appchainIds}/>
                    {/*<Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>*/}
                </Form>
            </Modal>
        </div>
    );
}




export default AddRule;
