import React from 'react';
import { Table, Input, InputNumber, Popconfirm, Form, Typography } from "antd";
import Item from "antd/lib/list/Item";
import { useEffect, useState } from "react";
import { useDispatch,useSelector } from "react-redux";
import { IUser, EditableCellProps } from "../model/user.interface";
import { onGetAllUsers } from '../redux/actions/simpleAction';

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
    
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const TableData = () => {
    const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [data, setData] = useState<IUser[]>([]);
  const [editingKey, setEditingKey] = useState<any>("");
  const users = useSelector((state:any)=> state.home.users);

   useEffect(() => {
    getAllUsers();
  }, []); 

  useEffect(() => {
    setData(users);
  }, [users]); 
 

  const deleteRecord = (record: IUser) => {
    const result = data.filter(item => item.id !== record.id);
    setData(result);
  }
  
  const getAllUsers =  () => {
    const users = localStorage.getItem('users');
    if(!users){
      dispatch(onGetAllUsers());
    }
      
  };

  const isEditing = (record: IUser) => record.id === editingKey;

  const edit = (record: Partial<IUser> & { id: React.Key }) => {
      console.log(record);
    form.setFieldsValue({
      ...record,
    });
    setEditingKey(record.id);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as IUser;

      const newData = [...data];
      const index = newData.findIndex((item) => key === item.id);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        localStorage.setItem('users', JSON.stringify(newData))
        setEditingKey("");
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const columns = [
    {
      title: "id",
      dataIndex: "id",
      width: "10%",
      editable: false,
    },
    {
      title: "name",
      dataIndex: "name",
      width: "20%",
      editable: true,
    },
    {
      title: "email",
      dataIndex: "email",
      width: "20%",
      editable: true,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      width: "20%",
      editable: true,
    },
    {
      title: "city",
      dataIndex: "city",
      width: "15%",
      editable: false,
      render: (_: any, record: IUser) =>{
        return record.address.city
    }
    },
    {
      title: "zipcode",
      dataIndex: "zipcode",
      width: "10%",
      editable: false,
      render: (_: any, record: IUser) =>{
          return record.address.zipcode
      }
    },
    {
      title: "operation",
      dataIndex: "operation",
      render: (_: any, record: IUser) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.id)}
              style={{ marginRight: 8 }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <>
            <Typography.Link
              disabled={editingKey !== ""}
              onClick={() => edit(record)}
            >
              Edit
            </Typography.Link>
            <span style={{marginLeft: '5px'}} >
            <Popconfirm title="Sure to Delete?" onConfirm={() => deleteRecord(record)}>
              <a>Delete</a>
            </Popconfirm>
            </span>
          </>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: IUser) => ({
        record,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <Form form={form} component={false}>
      <Table
        style={{margin: '50px'}}
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{
          onChange: cancel,
          pageSize: 6
        }}
      />
    </Form>
  );
};

export default TableData;


