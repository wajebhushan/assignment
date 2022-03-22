export interface IUser {
    id: string;
    name: string;
    email: string;
    address: {
      city: string,
      zipcode: string
    }
    phone: string;
  }
  
  
  export interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
      editing: boolean;
      dataIndex: string;
      title: any;
      inputType: 'number' | 'text';
      record: IUser;
      index: number;
      children: React.ReactNode;
    }
    