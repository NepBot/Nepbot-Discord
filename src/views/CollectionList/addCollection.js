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
    const [logo_url, setLogoUrl] = useState('');
    const [cover_url, setCoverUrl] = useState('');
    const [logo, setLogo] = useState(null);
    const [cover, setCover] = useState(null);
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
            // setConfirmLoading(true);
            const near = await connect(config);
            const wallet = new WalletConnection(near,"nepbot");
            const account = wallet.account() 

            //formData
            const params = {
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
            console.log(values,formData,'---formData----');
            formData.append('files',values['logo'][0]['originFileObj'])
            formData.append('files',values['cover'][0]['originFileObj'])
            

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
        setLogo(info.file)
        getBase64(info.file, imageUrl =>{
            setLogoUrl(imageUrl)
        });
    }
    function uploadCover(info){
        setCover(info.file)
        getBase64(info.file, imageUrl =>{
            setCoverUrl(imageUrl)
        });
    }
    const normFile = (e) => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
          return e;
        }
        return e && e.fileList;
    };

    function UploadLogoContent(){
        if(logo_url){
            return <img className={'logo-preview'} src={logo_url} alt="logo" style={{ width: '100%' }} />
        }else{
            return <div>
                click to upload logo
            </div>
        }
    }
    function UploadCoverContent(){
        if(cover_url){
            return <img className={'cover-preview'} src={cover_url} alt="cover" style={{ width: '100%' }} />
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
                        <Input bordered={false} placeholder="Account ID" onChange={(event)=>onChange(index,'account',event)}/>
                    </Form.Item>
				</div>
				<div className={'royalty-amount'}>
                    <div className={'royalty-amount-content'}>
                        <Form.Item name={['royaltyList',index,'amount']} noStyle>
                            <Input bordered={false} placeholder="0" onChange={(event)=>onChange(index,'amount',event)}/>
                        </Form.Item>
                    </div>
                </div>
				<div className={['form-remove-button', (index===0) ? 'hidden' : ''].join(' ')} onClick={()=>del(index)}></div>
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
        if(royaltyList.length>=10){return false;}
		form.setFieldsValue({"royaltyList":[...royaltyList,{account:'',amount:''}]})
		// return 
        setRoyaltyList([...royaltyList,{account:'',amount:''}])
        console.log(royaltyList);
	}
    const del = (index)=>{
		form.setFieldsValue({"royaltyList":[...royaltyList.slice(0,index),...royaltyList.slice(index+1)]})
		return setRoyaltyList([...royaltyList.slice(0,index),...royaltyList.slice(index+1)])
	}

    const roles = [{id:1,name:"A"},{id:2,name:"B"},{id:3,name:"C"}]
    const roleList = roles.map(item => 
        <Option value={item.id} key={item.id}>{item.name}</Option>
    );

    function checkUpload(){
        const type = "logo"
        if((type==='logo' && !logo) || (type==='cover' && !cover)){
            return false;
        }
        return true;
    }

    

    if(props.visible){
        return (
            <div className="my-modal collection-modal">
                <div className={'my-modal-header'}>Create Collection</div>
                <div className={'my-modal-content'}>
                    <Form
                        form={form}
                        name="basic"
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                        initialValues={{royaltyList:royaltyList,}}
                        
                    >
                        <div className={'my-modal-upload-box'}>
                            <div className={'upload-logo'}>
                                <Item
                                    label="Logo"
                                    name="logo"
                                    valuePropName="fileList"
                                    getValueFromEvent={normFile}
                                    rules={[
                                        () => ({
                                            validator() {
                                                if(logo) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject('upload logo');
                                            }
                                        })
                                    ]}
                                >
                                    <Upload
                                        name="upload_logo"
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
                                <div className={'upload-tip'}>JPG/JPEG/ PNG/GIF/SVG. Max size:1MB.</div>
                            </div>
                            
                            <div className={'upload-cover'}>
                                <Item
                                    label="Cover"
                                    name="cover"
                                    valuePropName="fileList"
                                    getValueFromEvent={normFile}
                                    rules={[
                                        () => ({
                                            validator() {
                                                if(cover) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject('upload cover');
                                            }
                                        })
                                    ]}
                                >
                                    <Upload
                                        name="upload_cover"
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
                                <div className={'upload-tip'}>JPG/JPEG/ PNG/GIF/SVG. Max size:1MB.</div>
                            </div>
                        </div>
                        
                        <Item
                            label="Name"
                            name="name"
                            rules={[{ required: true, message: 'Enter a name' }]}
                        >
                            <Input bordered={false}/>
                        </Item>
                        <Item
                            label="Description"
                            name="description"
                            rules={[{ required: true, message: 'Enter a description' }]}
                        >
                            <Input bordered={false}/>
                        </Item>
                        <Item
                            label="Mint Price"
                            name="mintPrice"
                        >
                            <Input bordered={false} type="number"/>
                        </Item>
                        <Item
                            label="Royalty"
                        >
                            <Royalty/>
                            <div className={'form-add-button'} onClick={add}>
                                Add
                            </div>
                        </Item>
                        <Item
                            label="Required Role"
                        >
                            <div className={'role-intro'}>Items in this collection can only be minted by members with at lease one of the selected roles. This collection is open to all if no roles are selected.</div>
                            <Item name="role_id">
                                <Select
                                    mode="multiple"
                                    placeholder="Please select"
                                    dropdownClassName={"collection-modal-role-dropdown"}
                                    // defaultOpen={true}
                                    // autoFocus={true}
                                    // open={true}
                                >
                                    {roleList}
                                </Select>
                            </Item>
                        </Item>
                    </Form>
                    <div className={'my-modal-footer'}>
                        <div className={'btn cancel'} onClick={()=>{ form.resetFields();props.onCancel(); }}>
                            cancel
                        </div>
                        <div className={'btn ok'} onClick={onCheck}>
                            ok
                        </div>
                    </div>
                </div>
            </div>
        );
    }else{
        return "";
    }
}




export default AddCollection;
