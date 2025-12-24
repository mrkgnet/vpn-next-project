import FetchUser from "@/actions/userAction";
import UserData from "./UserData";

export default async function FetchDataUser() {
   const result = await FetchUser();
  const data = result.success ? result.data : [];
  return <UserData initialUsers={data} />;
}