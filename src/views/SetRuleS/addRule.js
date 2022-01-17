import React, {useEffect} from 'react';
import {Modal, Form, Input, Button, Select} from "antd";
import {connect, WalletConnection} from "near-api-js";
import {config} from "../../config";
import {addRule, editRule} from "../../api/api";
const { Item } = Form;
const { Option } = Select;
function AddRule(props) {
    const [form] = Form.useForm();
    // const [checkNick, setCheckNick] = useState(false);
    const onFinish = async (values) => {
        console.log('Success:', values);

        const _near = await connect(config);
        const _wallet = new WalletConnection(_near,1);
        const account = await _wallet.account();
        // const data = await account.functionCall({contractId:'discord-roles.bhc8521.testnet', methodName:'set_roles',args:values});
        // console.log(data);
       const rule= await account.viewFunction('discord-roles.bhc8521.testnet','get_guild', {guild_id:values.guild_id});
        console.log(rule);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    useEffect(()=>{
      if(props.editData.hasOwnProperty('id')){
          form.setFieldsValue(props.editData)
      }
    })


    const onCheck = async () => {
        try {
            const values = await form.validateFields();
            console.log('Success:', values);
            if(props.editData.hasOwnProperty('id')){
                await editRule({id:props.editData.id,...values})
            }else{
                await addRule(values);
            }
            form.resetFields();
            props.onCancel();
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    };
    const {serverList} = props;
    const roleList = props.roleList.map(item=><Option value={item.id} key={item.id}>{item.name}</Option>);
    return (
        <div>
            <Modal title={props.title}   visible={props.visible} onOk={props.onOk} footer={[
                <Button key="back" onClick={props.onCancel}>
                    
                </Button>,
                <Button key="submit" htmlType="submit" type="primary" onClick={onCheck}>
                    
                </Button>
            ]} onCancel={props.onCancel}>
                <Form
                    form={form}
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Item
                        label=""
                        name="guild_id"
                        rules={[{ required: true, message: '' }]}
                    >
                        <Select>
                            <Option value={serverList.id}>{serverList.name}</Option>
                        </Select>
                    </Item>
                    <Item
                        label=""
                        name="role_id"
                        rules={[{ required: true, message: '' }]}
                    >
                        <Select>
                            {roleList}
                        </Select>
                    </Item>
                    <Item
                        label="token_address"
                        name="token_id"
                        rules={[{ required: true, message: 'token' }]}
                    >
                        <Input />
                    </Item>
                    <Item
                        label="token_amount"
                        name="amount"
                        rules={[{ required: true, message: 'token' }]}
                    >
                        <Input />
                    </Item>

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
