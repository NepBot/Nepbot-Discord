import React,{useState} from 'react';
import {Modal, Form, Input, Button, Select, Space} from "antd";
import {connect, WalletConnection} from "near-api-js";
import {getConfig} from "../../config";
import {signRule} from "../../api/api";
import {contract, parseAmount, sign} from "../../utils/util";

const config = getConfig()

const { Item } = Form;
const { Option } = Select;
function AddRule(props) {
    const [form] = Form.useForm();
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [type, setType] = useState('');
    const [isParas, setParas] = useState(false)
    // const [checkNick, setCheckNick] = useState(false);
    const onFinish = async (values) => {
        console.log('Success:', values);

        const _near = await connect(config);
        const _wallet = new WalletConnection(_near,1);
        const account = await _wallet.account();
        const rule= await account.viewFunction(config.RULE_CONTRACT,'get_guild', {guild_id:values.guild_id});
        console.log(rule);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    const onCheck = async () => {
        try {
            const values = await form.validateFields();
            let args = {
                guild_id: values.guild_id,
                role_id: values.role_id,
            }
            setConfirmLoading(true);
            const near = await connect(config);
            const wallet = new WalletConnection(near,"nepbot");
            const account = wallet.account()
            if (type == 'token amount') {
                let metadata = await account.viewFunction(values.token_id, 'ft_metadata', {})
                let amount = parseAmount(values.token_amount, metadata.decimals)
                args.key_field = ['token_id', values.token_id]
                args.fields = {token_amount: amount}
            } else if (type == 'oct roles') {
                args.key_field = ['appchain_id', values.appchain_id]
                args.fields = {oct_role: values.oct_role}
            } else if (type == 'near balance') {
                args.key_field = ['near', 'balance']
                args.fields = {balance: parseAmount(values.balance)}
            } else if (type == 'nft amount') {
                if (values.contract_id == 'x.paras.near') {
                    const fractions = values.collection_url.split("/")
                    const lastFraction = fractions[fractions.length - 1].split("?")
                    args.key_field = ['x.paras.near', lastFraction[0]]
                    args.fields = {token_amount: values.token_amount}
                } else {
                    await account.viewFunction(values.contract_id, 'nft_metadata', {})
                    args.key_field = ['nft_contract_id', values.contract_id]
                    args.fields = {token_amount: values.token_amount}
                }
            }
            
            
            const msg = {
                args: [args],
                sign: await sign(account, [args]),
                account_id: account.accountId
            }
            const _sign = await signRule(msg);
            const data = await account.functionCall(
                config.RULE_CONTRACT,
                'set_roles',
                 {args:JSON.stringify([args]),sign:_sign.sign},
                '300000000000000',
                '20000000000000000000000',
            );
            setTimeout(()=>{
                if(data){
                    setConfirmLoading(false);
                    form.resetFields();
                    props.onOk();
                }
            })
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    };
    const handleChangeType = async (v) => {
        setType(v);
    }
    const handleInputChange = async (v) => {
        setParas(v.target.value == "x.paras.near")
    }
    
    // const {serverList} = props;
    const {serverList} = props
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
                <Input />
            </Item>
            <Item
                label="token amount"
                name="token_amount"
                rules={[{ required: true, message: 'Enter a token amount' }]}
            >
                <Input />
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
                <Select>
                    {appchainIds}
                </Select>
            </Item>
            <Item
                label="oct role"
                name="oct_role"
                rules={[{ required: true, message: 'Please choose an oct role' }]}
            >
                <Select>
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
                <Input />
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
                <Input onChange={(v) => {handleInputChange(v)}}/>
            </Item>
            <Item
                label="collection url"
                name="collection_url"
                rules={[{ required: false, message: 'Please input collection id' }]}
                hidden={!isParas}
            >
                <Input />
            </Item>
            <Item
                label="amount"
                name="token_amount"
                rules={[{ required: true, message: 'Please input amount' }]}
            >
                <Input />
            </Item>
    
        </div>
    }




    return (
        <div className={'modal-box'}>
            <Modal title="Add Rule"   visible={props.visible} onOk={props.onOk}
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
                    <Item
                        label="server name"
                        name="guild_id"
                        rules={[{ required: true, message: 'Please choose a server' }]}
                    >
                        <Select>
                            <Option value={serverList.id}>{serverList.name}</Option>
                        </Select>
                    </Item>
                    <Item
                        label="role"
                        name="role_id"
                        rules={[{ required: true, message: 'Please choose a role' }]}
                    >
                        <Select>
                            {roleList}
                        </Select>
                    </Item>
                    <Item
                        label="type"
                        name="type"
                        rules={[{ required: true, message: 'Please choose a type' }]}
                    >
                        <Select onChange={(v)=>{handleChangeType(v)}}>
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
