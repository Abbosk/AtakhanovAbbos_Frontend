import React, {useEffect} from 'react';
import {Button, Card, Form, Input, Layout, message, Spin, Typography} from "antd";
import './auth.css'
import {useMutation} from "react-query";
import apiService from "../../service/api";
import {useNavigate} from "react-router-dom";

const {Title}=Typography


const initialValues={
    email: '',
    password: '',
}
//
// const initialValues={
//     email: 'islom@gmail.com',
//     password: '12345678',
// }
const Index = () => {
    const [form] = Form.useForm();
    const navigate=useNavigate()

    const {
        mutate,
        data,
        isLoading,
        isSuccess,
    } = useMutation(({url, data}) => apiService.postData(url, data), {
        onSuccess: () => {

            message.success('Success')
        },
        onError: (error) => {
            for (let obj in error.response.data) {
                message.error(`${error.response.status}.${obj}: ${error.response.data[obj][0]}`)
            }
        }
    });

    useEffect(() => {
        if (isSuccess){
            localStorage.setItem('seToken',data.access)
            navigate('/')
            form.setFieldsValue(initialValues)
        }
    }, [data]);


    const onFinish=(value)=>{

        mutate({url: "/user/token/", data: value});
    }

    const onFinishFailed=(error)=>{
        console.log(error)
    }

    return (
        <Layout style={{minHeight:'100vh'}}>
        <div className={'auth-wrap'}>
            <Card className={'auth-card'}>
                <Title level={3} style={{textAlign:'center'}}>Login</Title>
                <div className='sign'>
                    <div className='sign-content'>
                        <Form
                            form={form}
                            className='sign-form'
                            name='basic'
                            initialValues={initialValues}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}>
                            <Form.Item
                                name='email'
                                rules={[{required: true, message: 'Please input your Login!'}]}
                                wrapperCol={{
                                    span: 24,
                                }}
                            >
                                <Input placeholder={'Email'} />
                            </Form.Item>

                            <Form.Item
                                name='password'
                                rules={[{required: true, message: 'Please input your Password!'}]}
                                wrapperCol={{
                                    span: 24,
                                }}
                            >
                                <Input.Password placeholder={'Password'} />
                            </Form.Item>


                            <div className='form-btn-field'>
                                <Button type='primary' disabled={isLoading} htmlType='submit' className='sign-btn' style={{width:'100%'}}>
                                    <p>Login</p> <Spin  size={'small'} spinning={isLoading}></Spin>
                                </Button>
                            </div>


                        </Form>
                    </div>
                </div>

            </Card>
        </div>
        </Layout>
    );
};

export default Index;