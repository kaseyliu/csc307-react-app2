import express from "express";
import cors from "cors";
import userServices from "./user-services.js";
import e from "express";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.listen(port, () => {
    console.log(`Example app listening at http://localhost${port}`);
})

app.get('/users', (req, res) => {
    /* fetch all users */
    const name = req.query.name;
    const job = req.query.job;
    userServices.getUsers(name, job)
        .then((result) => {
            if (result) {
                res.send({ users_list: result});
            }
            else {
                res.status(404).send('Resource not found');
            }
        })
        .catch((error) => {
            res.status(500).send(error);
        });
});

app.get('/users/:id', (req, res) => {
    /* fetch users by id */
    const id = req.params['id']; //or req.params.id
    userServices.findUserById(id)
        .then((result) => {
            if (result === undefined) {
                res.status(404).send('Resource not found.');
            } else {
                res.send(result);
            }
        })
        .catch((error) => {
            res.status(500).send(error);
        });
});

app.post('/users', (req, res) => {
    /* create and insert new user */
    const userToAdd = req.body;
    userServices.addUser(userToAdd)
        .then((added) => {
            res.status(201).send(added);
        })
        .catch((error) => {
            res.status(500).send(error);
        });
});

app.delete('/users/:id', (req, res) => {
    const id = req.params['id'];
    console.log("id: ", id);
    userServices.deleteUserById(id)
        .then((deleted) => {
            console.log("Deleted user:", deleted); 
            if(deleted) {
                res.status(204).send(deleted);
            }
            else {
                res.status(404).send('Resource not found.');
            }
        })
        .catch((error) => {
            console.error("Error:", error); 
            res.status(500).send(error);
        })
})