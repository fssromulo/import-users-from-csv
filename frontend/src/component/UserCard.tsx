import React from "react";
import "../App.css";

interface UserData {
  id: number;
  name: string;
  city: string;
  country: string;
  favorite_sport: string;
}

interface Props {
  item: UserData;
}

function UserCard({ item }: Props) {
  return (
    <div className="card" key={item.id} data-testid="info-card">
      <div className="cardTitle">
        <span>
          <b>Name:</b> {item.name}
        </span>
      </div>
      <div>
        <span>
          <b>City:</b> {item.city}
        </span>
        &nbsp;/&nbsp;
        <span>
          <b>Country:</b> {item.country}
        </span>
      </div>
      <div>
        <b>Favorite sport:</b> {item.favorite_sport}
      </div>
    </div>
  );
}

export default UserCard;
