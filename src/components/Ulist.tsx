import {
  ReactElement,
  JSXElementConstructor,
  ReactNode,
  ReactPortal,
} from "react";
import useUserList from "../lib/api/OnlineList";

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
          background:
            "linear-gradient(to bottom, rgba(255, 255, 255, 0.4) , rgba(96, 156, 140, 0.5))",
          border: "2px solid rgba(0, 0, 0, 0.2)",
          boxShadow:
            "inset 2px 2px 4px rgba(0, 0, 0, 0.1), 4px 4px 8px rgba(0, 0, 0, 0.2)",
        }}
      >
        <span style={{ fontWeight: "bold" }}>
          <img height="20" src={`furrchat/assets/PeopleIcon.png`} />
          {` There are currently ${userList.length} users online.`}
        </span>
        <br />
        <hr />
        {userList.map(
          (user: {
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
                src={`https://uploads.meower.org/icons/${user.avatar}`}
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
