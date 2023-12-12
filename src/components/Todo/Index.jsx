import React, {useEffect, useState} from 'react';
import TodoTable from './TodoTable';
import {Button, Col, Input, Layout, message, Row, Space, Spin, Typography} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import {useNavigate} from 'react-router-dom';
import apiService from '../../service/api';
import {useMutation, useQuery} from 'react-query';
import {useDispatch} from "react-redux";
import {editAction} from "../../slice/editData";
import {Content} from "antd/es/layout/layout";

import './todo.css'

const {Title} = Typography
const Index = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {
        mutate,
        isSuccess,
        isLoading: deleteCategoryLoading,
    } = useMutation(({url, id}) => apiService.deleteData(url, id));
    const {
        data,
        isLoading: getCategoryLoading,
        refetch,
    } = useQuery('todo-get', () => apiService.getData('/tasks'), {
        // enabled:false,
    });
    const [search, setSearch] = useState([]);
    const [isSearch, setIsSearch] = useState(false);
    const deleteHandle = (url, id) => {
        mutate({url, id});
    };

    useEffect(() => {
        if (isSuccess) {
            refetch();
        }
    }, [isSuccess]);

    const addArticle = () => {
        dispatch(editAction(''));
        navigate('/add');
    };
    const serachProduct = (value) => {
        if (value === '') {
            setIsSearch(false);
        } else {
            setIsSearch(true);
        }

        const filterData = data?.filter(
            (data) =>
                data.title.toLowerCase().includes(value.toLowerCase()),
        );
        setSearch(filterData);
    };

    const logout = () => {
        localStorage.removeItem('seToken')
        navigate('/signin')
    }

    return (
        <Layout style={{minHeight: '100vh'}}>
            <div className={'container'}>

                <Content>
                    <Space direction={'vertical'} style={{width: '100%'}}>
                        <Row gutter={20}>
                            <Col span={24}>
                                <Space align={"center"} className={'title-btn'}>
                                    <div></div>
                                    <Title style={{textAlign: 'center',marginBottom:0}} level={1}>SE 2-20</Title>
                                    <Button type="primary" danger onClick={logout}>
                                        Log out
                                    </Button>
                                </Space>
                            </Col>
                            <Col span={16}>
                                <Input onChange={(e) => serachProduct(e.target.value)}/>
                            </Col>
                            <Col span={8}>
                                <Button
                                    type='primary'
                                    icon={<PlusOutlined/>}
                                    style={{width: '100%'}}
                                    onClick={addArticle}>
                                    Add
                                </Button>
                            </Col>
                        </Row>
                        <Spin
                            size='medium'
                            spinning={getCategoryLoading || deleteCategoryLoading}>
                            <TodoTable
                                data={isSearch ? search : data}
                                deleteHandle={deleteHandle}
                            />
                        </Spin>
                    </Space>
                </Content>
            </div>

        </Layout>
    );
};

export default Index;