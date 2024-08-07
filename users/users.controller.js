import * as usersModel from "./users.model.js";
//API Guts
export async function getUsers(req, res) {
  const username = req.query.username;
  const users = username
    ? await usersModel.getUsersByUsername(username)
    : await usersModel.getUsers();

  res.json({
    success: true,
    payload: users,
  });
}

export async function getUserById(req, res) {
  const userId = req.params.id;
  const user = await usersModel.getUserById(userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      reason: `No user with id ${userId} found`,
    });
  }

  res.json({
    success: true,
    payload: user,
  });
}

export async function createUser(req, res) {
  const { username } = req.body;
  const createdUser = await usersModel.createUser({ username });

  res.status(201).json({
    success: true,
    payload: createdUser,
  });
}

export async function deleteUserById(req, res) {
  const idToDelete = req.params.id;
  const deletedUser = await usersModel.deleteUserById(idToDelete);

  if (!deletedUser) {
    return res.status(404).json({
      success: false,
      reason: `No user with id ${idToDelete} found`,
    });
  }

  res.json({
    success: true,
    payload: deletedUser,
  });
}
