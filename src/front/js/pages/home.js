import React, { useContext } from "react";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import "../../styles/home.css";

export const Home = () => {
	const { store, actions } = useContext(Context);

	return (
		<div className="text-center mt-5">
			<h1>Estamos trabajando....</h1>
			<p>
			<img src="https://i.pinimg.com/originals/32/d8/24/32d824c66045b518f537ce7bb6b6013d.gif" alt="Estamos trabajando" />			
			</p>
			<div className="alert alert-info">
				{store.message || "Loading message from the backend (make sure your python backend is running)..."}
			</div>
		</div>
	);
};
