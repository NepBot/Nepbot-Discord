import React,{useState} from 'react';
import {Modal, Form, Input, Button,Select, Dragger, Upload,message} from "antd";
import {connect, WalletConnection} from "near-api-js";
import {getConfig} from "../../config";
import {signRule,createCollection} from "../../api/api";
import {contract, parseAmount, sign} from "../../utils/util";

const config = getConfig()

const { Item } = Form;
const { Option } = Select;
function AddCollection(props) {
    const [form] = Form.useForm();
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [logo, setLogo] = useState('');
    const [cover, setCover] = useState('');
    const [royaltyList,setRoyaltyList] = useState([{account:'',amount:''}])
    // const [isParas, setParas] = useState(false)

    const onFinish = async (values) => {
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
            // let args = {
            //     guild_id: values.guild_id,
            //     role_id: values.role_id,
            // }
            setConfirmLoading(true);
            const near = await connect(config);
            const wallet = new WalletConnection(near,"nepbot");
            const account = wallet.account() 

            //authorization

            //formData
            const params = {
                // files:[values.logo,values.cover],
                collection: values.name,
                description:values.description,
                creator_id: account.accountId,
                twitter: "",
                website: "",
                discord: "",
            }
            const formData = new FormData();
            Object.keys(params).forEach((key) => {
                formData.append(key, params[key]);
            });
            formData.append('files',values.logo)
            formData.append('files',values.cover)

            //paras - collection
            const res = await createCollection(formData);
            // console.log(res,'paras-res');
            
            // const msg = {
            //     args: {
            //         sign:localStorage.getItem("nepbot_wallet_auth_key").allKeys
            //     },
            //     sign: await sign(account, [args]),
            //     account_id: account.accountId
            // }
            // const _sign = await signRule(msg);
            // const data = await account.functionCall(
            //     config.NFT_CONTRACT,
            //     'create_collection',
            //      {args:JSON.stringify([args]),..._sign},
            //     '300000000000000',
            //     '20000000000000000000000',
            // );
            // setTimeout(()=>{
            //     if(data){
            //         setConfirmLoading(false);
            //         form.resetFields();
            //         props.onOk();
            //     }
            // })
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    };

    

    function beforeUpload(file) {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
          message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    }

    function getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    function uploadLogo(info){
        console.log(info,'info');
        getBase64(info.file, imageUrl =>
            setLogo(imageUrl)
        );
    }
    function uploadCover(info){
        console.log(info,'info');
        getBase64(info.file, imageUrl =>
            setCover(imageUrl)
        );
    }
    const normFile = (e) => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
          return e;
        }
        return e && e.fileList;
    };

    function UploadLogoContent(){
        if(logo){
            return <img src={logo} alt="logo" style={{ width: '100%' }} />
        }else{
            return <div>
                click to upload logo
            </div>
        }
    }
    function UploadCoverContent(){
        if(cover){
            return <img src={cover} alt="cover" style={{ width: '100%' }} />
        }else{
            return <div>
                click to upload cover
            </div>
        }
    }
    function Royalty(){
        const setRoyaltyItems = royaltyList.map((item,index) => {
            return <div key={index} className={'royalty-item'}>
				<div className={'royalty-account'}>
					<Form.Item name={['royaltyList',index,'account']} noStyle>
                        <Input placeholder="Account ID" onChange={(event)=>onChange(index,'account',event)}/>
                    </Form.Item>
				</div>
				<div className={'royalty-amount'}>
					<Form.Item name={['royaltyList',index,'amount']} noStyle>
                        <Input placeholder="0" onChange={(event)=>onChange(index,'amount',event)}/>
                    </Form.Item>
				</div>
				<div className={'royalty-del'} type="primary" onClick={()=>del(index)}>delete</div>
			</div>
        })
        return (<div className={'royalty-list'}>
            {setRoyaltyItems}
        </div>)
    }
    const onChange = (index,name,event)=>{
		let tempArray = [...royaltyList];
		if('account'===name)
			tempArray[index] = {...tempArray[index],account:event.target.value}
		else
			tempArray[index] = {...tempArray[index],amount:event.target.value}
		return setRoyaltyList(tempArray)
	}
    const add = ()=>{
		form.setFieldsValue({"royaltyList":[...royaltyList,{account:'',amount:''}]})
		// return 
        setRoyaltyList([...royaltyList,{account:'',amount:''}])
        console.log(royaltyList);
	}
    const del = (index)=>{
		form.setFieldsValue({"royaltyList":[...royaltyList.slice(0,index),...royaltyList.slice(index+1)]})
		return setRoyaltyList([...royaltyList.slice(0,index),...royaltyList.slice(index+1)])
	}
    const roleList = props.roleList.map(item => 
        <Option value={item.id} key={item.id}>{item.name}</Option>
    );


    return (
        <div className={'modal-box'}>
            <Modal title="Add Collection" wrapClassName="collection-modal"   visible={props.visible} onOk={props.onOk}
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
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    initialValues={{royaltyList:royaltyList,}}
                >
                    <Item
                        label="Logo"
                        name="logo"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                        rules={[{ required: true, message: 'upload logo' }]}
                    >
                        <Upload
                            name="logo"
                            listType="picture-card"
                            className="logo-uploader"
                            showUploadList={false}
                            // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                            beforeUpload={beforeUpload}
                            // onChange={handleChange}
                            customRequest={uploadLogo}
                        >
                            <UploadLogoContent/>
                        </Upload>
                    </Item>
                    <Item
                        label="Cover"
                        name="cover"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                        rules={[{ required: true, message: 'upload cover' }]}
                    >
                        <Upload
                            name="cover"
                            listType="picture-card"
                            className="cover-uploader"
                            showUploadList={false}
                            // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                            beforeUpload={beforeUpload}
                            // onChange={handleChange}
                            customRequest={uploadCover}
                        >
                            <UploadCoverContent/>
                        </Upload>
                    </Item>
                    <Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Enter a name' }]}
                    >
                        <Input/>
                    </Item>
                    <Item
                        label="Description"
                        name="description"
                        rules={[{ required: true, message: 'Enter a description' }]}
                    >
                        <Input/>
                    </Item>
                    <Item
                        label="Mint Price"
                        name="mintPrice"
                        rules={[{ required: true, message: 'Enter price' }]}
                    >
                        <Input/>
                    </Item>
                    <Item
                        label="Royalty"
                    >
                        <Royalty/>
                        <Button type="primary" onClick={add}>+</Button>
                    </Item>
                    <Item
                        label="Role"
                        name="role_id"
                        // rules={[{ required: true, message: 'Please choose a role' }]}
                    >
                        <Select
                            mode="multiple"
                            allowClear
                            style={{ width: '100%' }}
                            placeholder="Please select"
                            dropdownClassName={"collection-modal-role-dropdown"}
                        >
                            {roleList}
                        </Select>
                    </Item>
                </Form>
            </Modal>
        </div>
    );
}




export default AddCollection;
