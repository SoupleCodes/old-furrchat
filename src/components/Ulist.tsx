import {
  ReactElement,
  JSXElementConstructor,
  ReactNode,
  ReactPortal,
} from "react";
import useUserList from "../lib/api/OnlineList";
import { defaultPFPS } from "../lib/Data";

const UListBody = () => {
  const userList: any = useUserList();

  return (
    <>
      <div
        className="uList"
        style={{
          borderRadius: "8px",
          padding: "12px",
          margin: "20px",
          marginBottom: "0px",
          border: "1px solid #83838396",
          background:
            "linear-gradient(to bottom, rgba(255, 255, 255, 0.4) , rgba(96, 156, 140, 0.5))",
          boxShadow:
            "5px 5px 10px rgba(0, 0, 0, 0.5), -5px -5px 10px rgba(255, 255, 255, 0.3), 0 3px 1px rgba(0, 0, 0, 0.2), 0 2px 0 0 rgba(255, 255, 255, 0.7) inset",
        }}
      >
        <span style={{ fontWeight: 600, color: "#333" }}>
          <img height="20" src={`/furrchat/assets/PeopleIcon.png`} />
          {` There are currently ${userList.length} users online.`}
        </span>
        <br />
        <hr />
        {userList.map(
          (user: {
            pfp_data: number;
            avatar: any;
            _id:
              | string
              | number
              | boolean
              | ReactElement<any, string | JSXElementConstructor<any>>
              | Iterable<ReactNode>
              | ReactPortal
              | null
              | undefined;
          }) => (
            <button
              style={{
                padding: "5px",
                boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.1)",
                background:
                  "linear-gradient(to bottom, rgba(255, 255, 255, 0.2) , rgba(255, 255, 255, 0.3))",
                border: "1px solid rgba(0, 0, 0, 0.2)",
              }}
            >
              <img
                height={18}
                width={18}
                src={
                  user.avatar === ""
                    ? user.pfp_data === -3
                      ? "/furrchat/assets/default_pfps/icon_guest-e8db7c16.svg"
                      : `${defaultPFPS[34 - user.pfp_data]}`
                    : `https://uploads.meower.org/icons/${user.avatar}`
                }
              />{" "}
              {user._id}
            </button>
          )
        )}
      </div>
      <br />
    </>
  );
};

export default UListBody;