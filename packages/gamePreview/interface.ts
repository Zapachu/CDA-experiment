import { Document } from 'mongoose';
interface IDocument extends Document {
  updateAt: number;
  createAt: number;
}

export interface UserDoc extends IDocument {
    phone: string;
    mobile: string;
    role: number;
    name: string;
    password: string;
    email: string;
    stuNum: string;
    status: number;
    gender: string;
    headimg: string;
    orgCode: string;
    orgName: string;
    wallet: string;
    icName: string;
    icNumber: string;
    wxmedia: string;
    wxname: string;
    wxOpenId: string;
    wxUnionId: string;
    wxprovince: string;
    wxcity: string;
    wxcountry: string;
    wxSubscribe: number;
    permissionRole: string;
    lastLogin: number;
    birth: Date;
}