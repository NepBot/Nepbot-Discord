import React,{useState} from 'react';
import {useHistory} from 'react-router-dom'
import {Form, Input,InputNumber,Select, Upload,message} from "antd";
import {connect, WalletConnection} from "near-api-js";
import {getConfig} from "../../config";
import {signRule,createCollection, getCollection} from "../../api/api";
import {contract, parseAmount, sign} from "../../utils/util";
import Mintbase from '../../utils/mintbase'
import store from "../../store/discordInfo";
import js_sha256 from "js-sha256";
import icon_upload from '../../assets/images/icon-upload.png';
import loading from '../../assets/images/loading.png';
import { requestTransaction } from '../../utils/contract';

const config = getConfig()

const { Item } = Form;
const { Option } = Select;
const { Dragger } = Upload;
function AddCollection(props) {
    const [form] = Form.useForm();
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [logo_url, setLogoUrl] = useState('');
    const [cover_url, setCoverUrl] = useState('');
    const [logo, setLogo] = useState(null);
    const [cover, setCover] = useState(null);
    const [royaltyList,setRoyaltyList] = useState([{account:'',amount:''}])
    const [royalty,setRoyalty] = useState({})
    const history = useHistory()
    const [showConfirmModal, setConfrimModalStatus] = useState(false);
    const [parasCreatedList,setParasCreatedList] = useState([]);
    // const [isParas, setParas] = useState(false)

    const onFinish = async (values) => {
        const _near = await connect(config);
        const _wallet = new WalletConnection(_near,1);
        const account = await _wallet.account();
        const rule= await account.viewFunction(config.RULE_CONTRACT,'get_guild', {guild_id:values.guild_id});
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    const onCheck = async () => {
        const values = await form.getFieldValue();
        const royalty_list = {};
        let isAccess = true;
        values.royaltyList.forEach((royalty,index)=>{
            if(royalty.account && royalty.amount){
                royalty_list[royalty.account] = royalty.amount * 100;
            }else if((royalty.account && !royalty.amount) || (!royalty.account && royalty.amount)){
                if(!royalty.account){
                    document.getElementsByClassName("royalty-account-tip"+index)[0].style.display = "block";
                    isAccess = false
                }else if(!royalty.amount){
                    document.getElementsByClassName("royalty-amount-tip"+index)[0].style.display = "block";
                    isAccess = false
                }
            }
        })
        await form.validateFields();
        if(!isAccess){return}
        setRoyalty(royalty_list)
        setConfrimModalStatus(true);
    }
    const submitForm= async () => {
        if(confirmLoading){
            return;
        }
        try {
            const values = await form.validateFields();
            const info = store.get("info")
            const operationSign = store.get("operationSign")
            setConfirmLoading(true);
            const near = await connect(config);
            const wallet = new WalletConnection(near,"nepbot");
            const account = wallet.account() 
            const outerCollectionId = `${values.name.replace(/\s+/g, "-")}-guild-${props.server.name.replace(/\s+/g, "-")}-by-${config.NFT_CONTRACT.replaceAll(".", "")}`.toLowerCase().replaceAll(".", "");
            let res = null;
            if(props.platform == 'paras'){
                const collection = await getCollection(outerCollectionId);
                if (!collection || collection.results.length > 0 || parasCreatedList.indexOf(values.name)>-1) {
                    try{
                        const check_res = await account.viewFunction(config.NFT_CONTRACT, "get_collection", {collection_id: `paras:${outerCollectionId}`})
                        setConfirmLoading(false);
                        setConfrimModalStatus(false)
                        message.error("Collection name has already been taken");
                        return;
                    }catch(e){
                        res = {
                            collection_id : outerCollectionId,
                        }
                    }
                }else{
                    //formData
                    let params = {
                        args: {
                            args: {
                                collection: `${values.name.replace(/\s+/g, "-")}-guild-${props.server.name.replace(/\s+/g, "-")}`,
                                description:values.description,
                                creator_id: config.NFT_CONTRACT,
                                twitter: "",
                                website: "",
                                discord: "",
                            },
                            sign: operationSign,
                            user_id: info.user_id,
                            guild_id: info.guild_id
                        },
                        account_id: account.accountId,
                    }
                    params.sign = await sign(account, params.args)
                    const formData = new FormData();
                    formData.append('files',values['logo'][0]['originFileObj'])
                    formData.append('files',values['cover'][0]['originFileObj'])
                    formData.append('args', JSON.stringify(params))
                    
                    //paras - collection
                    res = await createCollection(formData);
                    if(res.collection_id){
                        setParasCreatedList([...parasCreatedList,values.name])
                    }
                }
            }else if(props.platform == 'mintbase'){
                const minter = await Mintbase()
                const logo_res = await minter.upload(values['logo'][0]['originFileObj'])
                const cover_res = await minter.upload(values['cover'][0]['originFileObj'])
                await minter.setMetadata({metadata: {
                    name:values.name.trim(),
                    description:values.description,
                    logo:logo_res.data.uri,
                    background: cover_res.data.uri,
                }})
                const result = await minter.getMetadataId();
                res = {collection_id:result.data}
            }

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

            //contract request
            const contract_args = {
                outer_collection_id: res.collection_id,
                contract_type: props.platform,//'paras'
                guild_id: info.guild_id,
                royalty:royalty,
                mintable_roles: values.role_id,
                price: parseAmount(values.mintPrice) || "0",
                ..._sign
            }
            if(values.mintLimit){
                contract_args.mint_count_limit = parseInt(values.mintLimit)
            }
            const data = await requestTransaction(
                account,
                config.NFT_CONTRACT,
                "create_collection",
                contract_args,
                '300000000000000',
                '20000000000000000000000'
            )
            setTimeout(()=>{
                if(data){
                    setConfirmLoading(false);
                    setConfrimModalStatus(false);
                    form.resetFields();
                    setLogoUrl('');
                    setCoverUrl('');
                    props.onOk();
                }
            });
        } catch (errorInfo) {
            setConfirmLoading(false);
            console.log('Failed:', errorInfo);
        }
    };

    

    function beforeUpload(file) {
        const isAllowType = file.type === 'image/jpg' || file.type === 'image/jpeg' || file.type === 'image/png'|| file.type === 'image/gif' || file.type === 'image/svg+xml';
        if (!isAllowType) {
          message.error('Image must be a file of type: jpeg, jpg, png, gif, svg.');
        }
        const isLt1M = file.size / 1024 / 1024 < 1;
        if (!isLt1M) {
          message.error('File size exceeded（maximum is 1MB）');
        }
        return isAllowType && isLt1M;
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

    function UploadIntro(){
        return <div className={'upload-intro'}>
            <img className={'icon-upload'} src={icon_upload} alt="iconUpload" />
            <div className={'upload-intro-txt'}>Drag and drop files to upload</div>
            <span>or</span>
            <div className={'upload-intro-btn'}>Browse</div>
        </div>
    }
    function UploadLogoContent(){
        if(logo_url){
            return <img className={'logo-preview'} src={logo_url} alt="logo" />
        }else{
            return <UploadIntro/>
        }
    }
    function UploadCoverContent(){
        if(cover_url){
            return <img className={'cover-preview'} src={cover_url} alt="cover"/>
        }else{
            return <UploadIntro/>
        }
    }


    function Royalty(){
        const setRoyaltyItems = royaltyList.map((item,index) => {
            return <div key={index} className={'royalty-item'}>
				<div className={'royalty-account'}>
					<Item name={['royaltyList',index,'account']} noStyle>
                        <Input maxLength={64} bordered={false} placeholder="Near Account ID" onBlur={(event)=>onChange(index,'account',event)}/>
                    </Item>
                    <div className={'royalty-tip royalty-account-tip'+index}>Enter an account</div>
				</div>
				<div className={'royalty-amount'}>
                    <div className={'royalty-amount-content'}>
                        <Item name={['royaltyList',index,'amount']} noStyle>
                            <Input type="number" bordered={false} placeholder="0" onBlur={(event)=>onChange(index,'amount',event)}/>
                        </Item>
                    </div>
                    <div className={'royalty-tip royalty-amount-tip'+index}>Enter a number</div>
                </div>
				<div className={['form-remove-button', (index===0 && royaltyList.length<=1) ? 'hidden' : ''].join(' ')} onClick={()=>del(index)}></div>
			</div>
        })
        return (<div className={'royalty-list'}>
            {setRoyaltyItems}
        </div>)
    }
    const onChange = (index,name,event)=>{
		let tempArray = [...royaltyList];
		if('account'===name){
			tempArray[index] = {...tempArray[index],account:event.target.value}
		}else{
            if(event.target.value<0){
                message.error("Minimum number is 0")
                return false;
            }
            let total = Number(event.target.value);
            royaltyList.forEach(item=>{
                total+=Number(item.amount)
            })
            if(total>90){
                message.error("Maximum number of total royalty is 90%")
                return false;
            }
			tempArray[index] = {...tempArray[index],amount:event.target.value}
            
        }
		return setRoyaltyList(tempArray)
	}
    const add = ()=>{
        if(royaltyList.length>=10){return false;}
		form.setFieldsValue({"royaltyList":[...royaltyList,{account:'',amount:''}]})
		// return 
        setRoyaltyList([...royaltyList,{account:'',amount:''}])
	}
    const del = (index)=>{
		form.setFieldsValue({"royaltyList":[...royaltyList.slice(0,index),...royaltyList.slice(index+1)]})
		return setRoyaltyList([...royaltyList.slice(0,index),...royaltyList.slice(index+1)])
	}


    // const roles = [{id:1,name:"A"},{id:2,name:"B"},{id:3,name:"C"}]
    const roleList = props.roleList.map(item => 
        <Option value={item.id} key={item.id}>{item.name}</Option>
    );


    function ConfirmModal(){
        if(showConfirmModal){
            return <div className={'confrim-modal-mask'}>
                <div className={'confrim-modal'}>
                    <div className={'confrim-modal-title'}>Confirm</div>
                    <div className={'confrim-modal-info'}>Confirm this creation？</div>
                    <div className={'confrim-modal-btn my-modal-footer'}>
                        <div className={'btn cancel'} onClick={()=>{ setConfrimModalStatus(false) }}>
                            cancel
                        </div>
                        <div className={'btn ok'} onClick={submitForm}>
                            <span className={[confirmLoading ? 'hidden' : '']}>ok</span>
                            <img className={[confirmLoading ? '' : 'hidden']} src={loading}/>
                        </div>
                    </div>
                </div>
            </div>
        }else{
            return "";
        }
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
                                                return Promise.reject('Upload a logo');
                                            }
                                        })
                                    ]}
                                >
                                    <Dragger name="upload_logo" beforeUpload={beforeUpload} customRequest={uploadLogo}>
                                        <UploadLogoContent/>
                                    </Dragger>
                                </Item>
                                <div className={'upload-tip'}>JPG/JPEG/PNG/GIF/SVG. Max size:1MB.</div>
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
                                                return Promise.reject('Upload a cover');
                                            }
                                        })
                                    ]}
                                >
                                    <Dragger name="upload_cover" beforeUpload={beforeUpload} customRequest={uploadCover}>
                                        <UploadCoverContent/>
                                    </Dragger>
                                   
                                </Item>
                                <div className={'upload-tip'}>JPG/JPEG/PNG/GIF/SVG. Max size:1MB.</div>
                            </div>
                        </div>
                        
                        <Item
                            label="Name"
                            name="name"
                            // rules={[{ required: true, message: 'Enter a name' }]}
                            rules={[
                                { required: true, message: 'Enter a name' },
                                () => ({
                                    validator(_, val) {
                                        if(val == "" || (val && /^[0-9A-Z\s+]+$/i.test(val))) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject('Name must contain only letters(a-z) and numbers (0-9)');
                                    }
                                })
                            ]}
                        >
                            <Input maxLength={50}  bordered={false} placeholder="name of the collection"/>
                        </Item>
                        <Item
                            label="Description"
                            name="description"
                            rules={[{ required: true, message: 'Enter a description' }]}
                        >
                            <Input.TextArea showCount={false} maxLength={500}  autoSize={{ minRows: 1}} bordered={false} placeholder="tell others what the collection is about"/>
                        </Item>
                        <div className={'mint-price'}>
                            <Item
                                label="Mint Price"
                                name="mintPrice"
                                rules={[
                                    () => ({
                                        validator(_, val) {
                                            if(!val || (val>=0)) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject('Minimum mint price is 0');
                                        }
                                    })
                                ]}
                            >
                                <Input type="number" bordered={false} placeholder="Price per item"/>
                            </Item>
                        </div>
                        <Item
                            label="Royalty"
                        >
                            <Royalty/>
                            <div className={'form-add-button'} onClick={add}>
                                Add
                            </div>
                        </Item>
                        <div className={'required-role'}>
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
                        </div>
                        <div className={'mint-limit'}>
                            <Item
                                label="Minting Limit Per Wallet"
                            >
                                <div className={'role-intro'}>The maximum number of NFTs that can be minted per wallet.</div>
                                <Item
                                    name="mintLimit"
                                    rules={[
                                        () => ({
                                            validator(_, val) {
                                                if(!val || (val>=1)) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject("Minimum number is 1. Leave it blank if there's no limit.");
                                            }
                                        })
                                    ]}
                                >
                                    <Input type="number" bordered={false} placeholder=""/>
                                </Item>
                            </Item>
                            
                        </div>
                    </Form>
                    <div className={'my-modal-footer'}>
                        <div className={'btn cancel'} onClick={()=>{ form.resetFields();setLogoUrl('');setCoverUrl('');props.onCancel(); }}>
                            cancel
                        </div>
                        <div className={'btn ok'} onClick={onCheck}>
                            ok
                        </div>
                    </div>
                </div>
                <ConfirmModal/>
            </div>
        );
    }else{
        return "";
    }
}




export default AddCollection;
