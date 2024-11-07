import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];
export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);

  const [selcetedFriend, setSelcetedFriend] = useState(null);

  function handleShowAddFriend() {
    setShowAddFriend((show) => !show);
  }

  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setShowAddFriend(false);
  }
  function handleSelection(friend) {
    // setSelcetedFriend(friend);
    setSelcetedFriend((curr) => (curr?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }

  function handleSpiltBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selcetedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelcetedFriend(null);
  }
  return (
    <>
      <div className="app">
        <div className="sidebar">
          <FriendsList
            friends={friends}
            handleSelection={handleSelection}
            selcetedFriend={selcetedFriend}
          />

          {showAddFriend && (
            <FormAddFriend
              selcetedFriend={selcetedFriend}
              handleAddFriend={handleAddFriend}
              handleSelection={handleSelection}
            />
          )}

          <Button onClick={handleShowAddFriend}>
            {showAddFriend ? "close" : "Add Friend"}
          </Button>
        </div>
        {selcetedFriend && (
          <FormSpiltBill
            selcetedFriend={selcetedFriend}
            handleSpiltBill={handleSpiltBill}
            key={selcetedFriend.id}
          />
        )}
      </div>
    </>
  );
}
function Button({ children, onClick }) {
  return (
    <>
      <button className="button" onClick={onClick}>
        {children}
      </button>
    </>
  );
}
function FriendsList({ friends, handleSelection, selcetedFriend }) {
  // const friends = initialFriends; //lift her up tp app com
  return (
    <>
      <ul>
        {friends.map((f) => (
          <Friend
            friend={f}
            key={f.id}
            handleSelection={handleSelection}
            selcetedFriend={selcetedFriend}
          />
        ))}
      </ul>
    </>
  );
}
function Friend({ friend, handleSelection, selcetedFriend }) {
  const isSelected = selcetedFriend?.id === friend.id;
  return (
    <>
      <li className={isSelected ? "selected" : ""}>
        <img src={friend.image} alt={friend.name} />
        <h3>{friend.name}</h3>
        {friend.balance < 0 && (
          <p className="red">
            You own {friend.name} {Math.abs(friend.balance)}$
          </p>
        )}
        {friend.balance > 0 && (
          <p className="green">
            {friend.name} owns you {Math.abs(friend.balance)}$
          </p>
        )}
        {friend.balance === 0 && <p>You and {friend.name} are even</p>}
        <Button onClick={() => handleSelection(friend)}>
          {isSelected ? "close" : "select"}
        </Button>
      </li>
    </>
  );
}

function FormAddFriend({ handleAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;
    const id = crypto.randomUUID();

    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };
    handleAddFriend(newFriend);

    setName("");
    setImage("https://i.pravatar.cc/48");
  }
  return (
    <>
      <form className="form-add-friend" onSubmit={handleSubmit}>
        <label>🧑🏽‍🤝‍👩🏼Friend Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label>🖼️ Img URL</label>
        <input
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
        <Button>Add</Button>
      </form>
    </>
  );
}
function FormSpiltBill({ selcetedFriend, handleSpiltBill }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const paidByFriend = bill ? bill - paidByUser : "";
  const [whoIsPay, setWhoIsPay] = useState("user");

  function handleSubmit(e) {
    e.preventDefault();

    if (!bill || !paidByUser) return;

    handleSpiltBill(whoIsPay === "user" ? paidByFriend : -paidByUser);
  }
  return (
    <>
      <form className="form-split-bill" onSubmit={handleSubmit}>
        <h2>Spilt the bill with {selcetedFriend.name}</h2>

        <label>💵 Bill value</label>
        <input
          type="text"
          value={bill}
          onChange={(e) => setBill(Number(e.target.value))}
        />

        <label>🧑🏻 Your Expense</label>
        <input
          type="text"
          value={paidByUser}
          onChange={(e) =>
            setPaidByUser(
              Number(e.target.value) > bill
                ? paidByUser
                : Number(e.target.value)
            )
          }
        />

        <label>🧑🏽‍🤝‍👩🏼{selcetedFriend.name}'s Expense</label>
        <input type="text" disabled value={paidByFriend} />

        <label>🤑How will pay the bill ?</label>
        <select value={whoIsPay} onChange={(e) => setWhoIsPay(e.target.value)}>
          <option value="user">You</option>
          <option value="friend">{selcetedFriend.name}</option>
        </select>

        <Button>Spilt bill</Button>
      </form>
    </>
  );
}
