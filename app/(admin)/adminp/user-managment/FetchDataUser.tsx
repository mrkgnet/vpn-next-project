import FetchUser from "@/actions/userAction";
import UserData from "./UserData";

export default async function FetchDataUser() {
   const result = await FetchUser();
  // اضافه کردن چک کردن برای جلوگیری از undefined

 
const data = (result && result.success && result.data) ? result.data : [];

return <UserData initialUsers={data} />;
}