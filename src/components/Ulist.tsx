import { ReactElement, JSXElementConstructor, ReactNode, Key } from "react";
import useUserList from "../lib/api/OnlineList";
import { Link } from "react-router-dom";

const UListBody = () => {
  const userList: any = useUserList();
  return (
    <>
      <div className="uList">
        <div className="uList-heading">
        {`${userList.length} users:`}
        </div>
        <div className="uList-users">
        <span style={{ fontWeight: 600, color: "#333" }}>
        {userList.map((user: { _id: string | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Key | null | undefined; }, index: number) => (
          <span>
            <Link to={`/users/${user._id}`} className="user-button" style={{ fontWeight: '200' }}>
              {user._id}
            </Link>
            {index < userList.length - 1 && ", "}
          </span>
        ))}
        </span>
        </div>
    </div >
      <br />
    </>
  );
};

export default UListBody;