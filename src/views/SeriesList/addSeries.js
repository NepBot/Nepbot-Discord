import React,{useState} from 'react';
import {useHistory} from 'react-router-dom'
import {Form, Input, Upload,message} from "antd";
import {connect, WalletConnection} from "near-api-js";
import {getConfig} from "../../config";
import {signRule,createSeries} from "../../api/api";
import {contract, parseAmount, sign, encodeImageToBlurhash} from "../../utils/util";
import store from "../../store/discordInfo";
import icon_upload from '../../assets/images/icon-upload.png';

const config = getConfig()

const { Item } = Form;
const { Dragger } = Upload;
function AddSeries(props) {
    const [form] = Form.useForm();
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [image, setImage] = useState(null);
    const [image_url, setImageUrl] = useState('');
    const [attributeList,setAttributeList] = useState([{type:'',value:''}])
    const history = useHistory()
    // const [isParas, setParas] = useState(false)

    const onFinish = async (values) => {
        // const _near = await connect(config);
        // const _wallet = new WalletConnection(_near,1);
        // const account = await _wallet.account();
        // const rule= await account.viewFunction(config.RULE_CONTRACT,'get_guild', {guild_id:values.guild_id});
        // console.log(rule);
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
            
            const collection_id = props.collectionId
            const outer_collection_id = collection_id.split(":")[1]
            //authorization
            // console.log(imageUrl)
            // const blurhash = await encodeImageToBlurhash(imageUrl)
            // console.log(blurhash)
            // return
            //formData
            const params = {
                collection: values.name, 
                description:values.description,
                creator_id: account.accountId,
                collection_id: outer_collection_id,
                attributes:form.attributeList,
                mime_type: values.image[0].type,
                blurhash: "UE3UQdpLQ8VWksZ}Z~ksL#Z}pfkXVWp0kXVq"
            }
            const formData = new FormData();
            formData.append('files',values.image[0]['originFileObj'])
            formData.append('files',new Blob([JSON.stringify(params)], {type: 'application/json'}))

            //paras - collection
            const res = await createSeries(formData);

            const info = store.get("info")
            const operationSign = store.get("operationSign")
            const args = {
                sign: operationSign,
                user_id: info.user_id,
                guild_id: info.guild_id,
            }
            const msg = {
                args: args,
                sign: await sign(account, args),
                account_id: account.accountId
            }
            const _sign = await signRule(msg);
            if (!operationSign) {
                history.push({pathname: '/linkexpired', })
                return
            }
            await account.functionCall({
                contractId: config.NFT_CONTRACT,
                methodName: "add_token_metadata",
                args: {
                    collection_id: collection_id,
                    token_metadata: {
                        title: values.name,
                        description: values.description,
                        media: res[0].replace("ipfs://", ""),
                        reference: res[1].replace("ipfs://", ""),
                    },
                    ..._sign
                },
                gas: '300000000000000',
                attachedDeposit: '20000000000000000000000'
            })
            // await account.functionCall({
            //     contractId: "paras-token-v2.testnet",
            //     methodName: "nft_create_series",
            //     args: {
            //         //collection_id: collection_id,
            //         token_metadata: {
            //             title: values.name,
            //             description: values.description,
            //             media: res[0].replace("ipfs://", ""),
            //             reference: res[1].replace("ipfs://", ""),
            //         },
            //         //..._sign
            //     },
            //     attachedDeposit: '20000000000000000000000'
            // })
            
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    };

    

    function beforeUpload(file) {
        const isAllowType = file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png'|| file.type === 'image/gif' || file.type === 'image/svg+xml';
        if (!isAllowType) {
          message.error('You can only upload JPG/JPEG/PNG/GIF/SVG file!');
        }
        const isLt1M = file.size / 1024 / 1024 < 1;
        if (!isLt1M) {
          message.error('Image must smaller than 1MB!');
        }
        return isAllowType && isLt1M;
    }

    function getBase64(img, callback) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    function uploadImage(info){
        console.log(info,'info');
        setImageUrl(info.file)
        setImage(info.file)
        getBase64(info.file, imageUrl =>
            setImageUrl(imageUrl)
        );
    }
    const normFile = (e) => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
          return e;
        }
        console.log(e)
        return e && e.fileList;
    };

    function UploadImageContent(){
        if(image_url){
            return <img className={'logo-preview'} src={image_url} alt="image" />
        }else{
            return <div className={'upload-intro'}>
                <img className={'icon-upload'} src={icon_upload} alt="iconUpload" />
                <div className={'upload-intro-txt'}>Drag and drop files to upload</div>
                <span>or</span>
                <div className={'upload-intro-btn'}>Browse</div>
            </div>
        }
    }
    function Attribute(){
        const setAttributeItems = attributeList.map((item,index) => {
            return <div key={index} className={'attribute-item'}>
				<div className={'attribute-type'}>
					<Form.Item name={['attributeList',index,'type']} noStyle>
                        <Input bordered={false} placeholder="Type" onBlur={(event)=>onChange(index,'type',event)}/>
                    </Form.Item>
				</div>
				<div className={'attribute-value'}>
					<Form.Item name={['attributeList',index,'value']} noStyle>
                        <Input bordered={false} placeholder="Value" onBlur={(event)=>onChange(index,'value',event)}/>
                    </Form.Item>
				</div>
                <div className={['form-remove-button', (index===0) ? 'hidden' : ''].join(' ')} onClick={()=>del(index)}></div>
			</div>
        })
        return (<div className={'attribute-list'}>
            {setAttributeItems}
        </div>)
    }
    const onChange = (index,name,event)=>{
		let tempArray = [...attributeList];
		if('type'===name)
			tempArray[index] = {...tempArray[index],type:event.target.value}
		else
			tempArray[index] = {...tempArray[index],value:event.target.value}
		return setAttributeList(tempArray)
	}
    const add = ()=>{
		form.setFieldsValue({"attributeList":[...attributeList,{type:'',value:''}]})
		// return 
        setAttributeList([...attributeList,{type:'',value:''}])
        console.log(attributeList);
	}
    const del = (index)=>{
		form.setFieldsValue({"attributeList":[...attributeList.slice(0,index),...attributeList.slice(index+1)]})
		return setAttributeList([...attributeList.slice(0,index),...attributeList.slice(index+1)])
	}

    if(props.visible){
        return (
            <div className="my-modal series-modal">
                <div className={'my-modal-header'}>Create New Item</div>
                <div className={'my-modal-content'}>
                    <Form
                        form={form}
                        name="basic"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 14 }}
                        onFinish={onFinish}
                        onFinishFailed={onFinishFailed}
                        autoComplete="off"
                        initialValues={{attributeList:attributeList,}}
                    >
                        <div className={'upload-logo'}>
                            <Item
                                label="Image"
                                name="image"
                                valuePropName="fileList"
                                getValueFromEvent={normFile}
                                rules={[
                                    () => ({
                                        validator() {
                                            if(image) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject('upload image');
                                        }
                                    })
                                ]}
                            >
                                <Dragger name="upload_cover" beforeUpload={beforeUpload} customRequest={uploadImage}>
                                    <UploadImageContent/>
                                </Dragger>
                            </Item>
                            <div className={'upload-tip'}>JPG/JPEG/ PNG/GIF/SVG. Max size:1MB.</div>
                        </div>

                        <Item
                            label="Name"
                            name="name"
                            rules={[{ required: true, message: 'Enter a name' }]}
                        >
                            <Input bordered={false} placeholder="Item name"/>
                        </Item>
                        <Item
                            label="Description"
                            name="description"
                            rules={[{ required: true, message: 'Enter a description' }]}
                        >
                            <Input bordered={false} placeholder="Provide a detailed description of your item."/>
                        </Item>
                        <Item
                            label="Number of copies"
                            name="copyNumber"
                            rules={[{ required: true, message: 'Enter copy number' }]}
                        >
                            <Input bordered={false} placeholder="The number of items that can be minted." type="number"/>
                        </Item>
                        <Item
                            label="Attribute"
                        >
                            <Attribute/>
                            <div className={'form-add-button'} onClick={add}>
                                Add
                            </div>
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




export default AddSeries;
