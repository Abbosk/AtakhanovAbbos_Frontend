import React, {useEffect, useMemo, useState} from 'react';
import {Button, Col, Form, Input, message, Row, Select, Spin} from "antd";
import {useNavigate} from "react-router-dom";
import apiService from "../../service/api";
import {useMutation, useQuery} from "react-query";
import {useDispatch, useSelector} from "react-redux";
import {editAction} from "../../slice/editData";
import TextArea from "antd/es/input/TextArea";


const initialValueForm = {
    title: "",
    description: "",
    completed: null
};
const PostEdit = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate()
    const {editId} = useSelector(state => state.editData)
    const dispatch = useDispatch()


    // query-map
    const {
        mutate: postMapMutate,
        data: postMap,
        isLoading: postMapLoading,
        isSuccess: postMapSuccess,
        error: postMapError,
        isError: postMapIsError
    } = useMutation(({url, data}) => apiService.postData(url, data), {
        onSuccess: () => {

            message.success('Success')
        }
    });

    // query-edit
    const {
        isLoading: editTodoLoading,
        data: editTodoData,
        refetch: editTodoRefetch,
        isSuccess: editTodoSuccess,
        error: editTodoError,
        isError: editTodoIsError
    } = useQuery(["edit-map", editId], () => apiService.getDataByID("/tasks", editId), {
        enabled: false
    });
    // query-image

    // put-query
    const {
        mutate: putMap,
        isLoading: putMapLoading,
        data: putData,
        isSuccess: putMapSuccess
    } = useMutation(({
                         url,
                         data,
                         id
                     }) => apiService.editData(url, data, id));


    // map success
    useEffect(() => {
        if (putMapSuccess) {
            dispatch(editAction(''));
        }

        if (postMapSuccess || putMapSuccess) {

            navigate('/')
        }
    }, [postMap, putData])

    // map error
    useEffect(() => {
        if (postMapIsError) {
            message.error(postMapError.message)
        }
        if (editTodoIsError) {
            message.error(editTodoError.message)
        }
    }, [postMapError, editTodoError])


    // if edit map
    useEffect(() => {
        if (editId !== "") {
            editTodoRefetch();
        }
    }, [editId]);

    // if no edit map
    useEffect(() => {
        if (editId === "") {
            form.setFieldsValue(initialValueForm)
        }
    }, []);


    //edit news
    useEffect(() => {
        if (editTodoSuccess) {


            const edit = {
                title: editTodoData.title,
                description: editTodoData.description,
                completed: editTodoData.completed,
            }

            form.setFieldsValue(edit)
        }

    }, [editTodoData])


    const onFinish = (values) => {


        const formData = new FormData();

        formData.append('title', values.title);
        formData.append('description', values.description);
        formData.append('completed', values.completed);


        if (editTodoSuccess) {
            putMap({url: '/tasks', data: formData, id: editId})
        } else {
            postMapMutate({url: "/tasks/", data: formData});
        }


    }
    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };


    // refresh page again get data

    useEffect(() => {
        const storedValues = JSON.parse(localStorage.getItem('myFormValues'));
        if (storedValues) {
            storedValues.images = []
            form.setFieldsValue(storedValues);
        }

        const handleBeforeUnload = () => {

            localStorage.setItem(
                'myFormValues',
                JSON.stringify(form.getFieldsValue()),
            );
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            localStorage.removeItem('editDataId')
            localStorage.removeItem('myFormValues')
            window.removeEventListener('beforeunload', handleBeforeUnload);
        }
    }, []);


    const optionsCompleted = useMemo(() => {
        return [
            {
                value: true,
                label: 'Да',
            },
            {
                value: false,
                label: 'Нет',
            }
        ];
    }, []);


    return (
        <div className={'container'}>
            <Spin spinning={postMapLoading || editTodoLoading || putMapLoading} size='medium'>
                <Form
                    form={form}
                    name="basic"
                    labelCol={{
                        span: 24
                    }}
                    wrapperCol={{
                        span: 24
                    }}
                    style={{
                        maxWidth: "100%"
                    }}
                    initialValues={initialValueForm}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Row gutter={20}>
                        <Col span={24}>
                            <Form.Item
                                label="Название статьи"
                                name="title"
                                rules={[
                                    {
                                        required: true,
                                        message: "Требуется название статьи"
                                    }
                                ]}
                            >
                                <Input/>
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                label="Описание"
                                name="description"
                                rules={[
                                    {
                                        required: true,
                                        message: "Требуется описание"
                                    }
                                ]}
                            >
                                <TextArea rows={6}/>
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                label={'Это конец?'}
                                name={'completed'}
                                rules={[{
                                    required: true, message: 'Вы должны быть выбраны'
                                }]}
                                wrapperCol={{
                                    span: 24,
                                }}
                            >
                                <Select
                                    style={{
                                        width: '100%',
                                    }}
                                    optionLabelProp='label'
                                    options={optionsCompleted}
                                />
                            </Form.Item>
                        </Col>
                    </Row>


                    <Button type="primary" htmlType="submit" style={{width: "100%", marginTop: "20px"}}>
                        {
                            editTodoSuccess ? 'Edit' : 'Add'
                        }
                    </Button>
                </Form>
            </Spin>
        </div>
    );
};

export default PostEdit;