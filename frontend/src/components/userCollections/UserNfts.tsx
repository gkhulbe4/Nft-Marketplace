import UserCreatedNfts from "./userCreatedNfts";
import UserListedNfts from "./UserListedNfts";

function UserNfts() {
  return (
    <div className="flex flex-col gap-10">
      <UserCreatedNfts />
      <UserListedNfts />
    </div>
  );
}

export default UserNfts;
