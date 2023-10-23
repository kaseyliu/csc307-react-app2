import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";

function MyApp() {
    
    const [characters, setCharacters] = useState([]);

    function removeOneCharacter (index) {
        deleteUser(characters[index]._id);
        const updated = characters.filter((character, i) => {
        return i !==index 
        }) ;
        setCharacters(updated);
    }    

    function updateList(person) {
        postUser(person)
        .then((response) => {
            if(response.status === 201) {
                return response.json();
            }
            else {
                console.log("Received status code:", response.status);
            }
        })
        .then((newUser) => {
            console.log(newUser);
            setCharacters([...characters, newUser]);
        })
        .catch((error) => {
          console.log(error);
        })
    }

    function fetchUsers() {
        const promise = fetch("http://localhost:8000/users");
        return promise;
    }

    function postUser(person) {
        const promise = fetch("http://localhost:8000/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(person),
        });
    
        return promise;
      }

    function deleteUser(_id) {
        const promise = fetch(`http://localhost:8000/users/${_id}`, {
          method: "DELETE",
        })
            .then((res) => {
                if(res.status === 204) {
                    console.log("User deleted successfully.");
                } else if (res.status === 404) {
                    console.log("User with ID not found.");
                }
                else {
                    console.log("Failed to delete user with ID.");
                }
            })
            .catch((error) => {
                console.log(error);
                throw error;
            });
        return promise;
    }

    useEffect(() => {
        fetchUsers()
            .then((res) => res.json())
            .then((json) => setCharacters(json["users_list"]))
            .catch((error) => { console.log(error); });
    }, [] ); //use effect should only be called when myapp component first mounts (pass empty array)
    
    return (
        <div className="container">
            <Table characterData={characters}
                    removeCharacter={removeOneCharacter}/>
            <Form handleSubmit={updateList}/>
        </div>
    );
}
export default MyApp;