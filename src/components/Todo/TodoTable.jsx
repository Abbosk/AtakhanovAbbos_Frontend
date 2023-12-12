import {Button, Popconfirm, Space, Table, Tag} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import { useEffect, useState } from "react";
import {editAction} from "../../slice/editData";

const TodoTable = ({data,deleteHandle}) => {
    const dispatch=useDispatch()
    const navigate =useNavigate()
    const Delete = async (id) => {
        deleteHandle('/tasks',id)
    };

    const [reverseData,setReverseData]=useState([])

    const Edit = (id) => {
        localStorage.setItem('editDataId',id)
        dispatch(editAction(id));
        navigate('/add')
    };

    useEffect(()=>{
        const reverse=data?.reverse()
        setReverseData(reverse)
    },[data])
    const columns = [
        {
            title: 'Title',
            dataIndex: 'title',
            id: 'title',
            render: (text) => <p>{text}</p>,
        },
        {
            title: 'Completed',
            dataIndex: 'completed',
            id: 'completed',
            render: (text) => text ? <Tag color="#108ee9">Да</Tag> : <Tag color="#f50">Нет</Tag>,
        },
        {
            title: 'Action',
            id: 'action',
            render: (_, record) => (
                <Space size={20} >
                    <Button
                        onClick={() => Edit(record?.id)}
                        type='primary'
                        icon={<EditOutlined />}>
                        Edit
                    </Button>

                        <Button
                            onClick={() => Delete(record.id)}
                            type="primary" danger icon={<DeleteOutlined />}>
                            Delete
                        </Button>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Table
                columns={columns}
                dataSource={reverseData}
                expandable={{
                    expandedRowRender: (record) => (
                        <p
                            style={{
                                margin: 0,
                            }}
                        >
                            {record.description}
                        </p>
                    ),
                }}
                scroll={{
                    x: 500,
                }}
                rowKey={(record) => record.id}
            />
        </div>
    );
};



export default TodoTable;