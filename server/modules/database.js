import Todo from './models/Todo';
import User from './models/User';

export async function createTodo(text, userId) {
  try {
    let newTodo = new Todo({ text, userId });
      await newTodo.save();
      newTodo = Todo.findOne({ _id: newTodo._id }).populate('userId');
    return newTodo;
  } catch (e) {
    console.log(`FAILED to CREATE TODO ${text} = `, e);
    return null;
  }
}

export async function registerUser(displayName, email, password) {
  try {
    const newUser = new User({ displayName, email, password });
    await newUser.save();
  } catch (e) {
    console.log(`FAILED to REGISTER USER ${displayName} = `, e);
    return null;
  }
}

export async function getAllTodosByViewer(userId) { // by default, status = 'any'
  try {
    const todos = await Todo.find({userId}).populate('userId').sort({createdAt: 'descending'});
    return todos;
  } catch (e) {
    console.log(`FAILED to RETRIEVE ALL TODOS BY VIEWER! ${userId} = `,e);
    return null;
  }
}

export async function getPublicTodos() {
  try {
    const publicTodos = await Todo.find({}).populate('userId').sort({createdAt: 'descending'}); // so we can see the latest todo added
    console.log('publicTodos = ', publicTodos);
    return publicTodos;
  } catch (e) {
    console.log('FAILED to RETRIEVE PUBLIC TODOS = ', e)
  }
}

export async function getTodo(todoId) {
  try {
    const todo = await Todo.findOne({ _id: todoId }).populate('userId');
    console.log('todo found! node = ', todo)
    return todo;
  } catch (e) {
    console.log(`FAILED to RETRIEVE TODO id ${todoId} = `, e);
    return null;
  }
}

export async function getUser(userId) {
  try {
    const user = await User.findOne({_id: userId});
    console.log('getUser found! = ', user);
    return user;
  } catch (e) {
    console.log(`FAILED to RETRIEVE USER id ${userId} = `, e);
    return null;
  }
}

export async function renameTodo(todoId, text, prevText) {
  try {
    const updatedTodo = await Todo.findOneAndUpdate(
      {
        _id: todoId
      },
      {
        $set: {
          text: text
        }
      },
      {
        new: true
      },
    );
    return updatedTodo;
  } catch (e) {
    console.log(`FAILED to RENAME todo id ${todoId} = `, e);
    return null;
  }
}
export async function likeTodo(todoId, userId) { // userId is likerId
  try {
    const todo = await Todo.findOne({_id: todoId}).populate('userId'); // retrieve todo in db
      console.log('todo = ', todo);
    var updatedLikersUserId, updatedLikes;
    const userLiked = todo.likersUserId.map(id => id.toString()).includes(userId.toString()); // check if user existed on likersUserIdField
    if (userLiked) { // userId on likersUserId
      updatedLikersUserId = todo.likersUserId.map(id => id.toString()).filter( id => id !== userId.toString()); // remove userId
      updatedLikes = Number(todo.likes) - 1; // decrease likes
    } else if (!userLiked) { // userId not on liked
      updatedLikersUserId = [...todo.likersUserId.map(id => id.toString()), userId]; // add userId
      updatedLikes = Number(todo.likes) + 1; // increase likes
      // user has not liked the todo, let's announce it to the owner of the todo by notification
      const todoOwner = await User.findOne({ _id: todo.userId._id }) // owner of the todo to notify
      console.log('todoOwner = ', todoOwner);
      const userNotified = await User.findOneAndUpdate(
        { _id: todoOwner._id },
        {
          $set: {
            notifications: [
              ...todoOwner.notifications,
              { likerId: userId, todoId, seen: false }
            ]
          }
        },
        { new: true }
      );
      console.log('userNotified = ', userNotified);
    }
    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: todoId },
      { 
        $set: { // update fields
          likersUserId: updatedLikersUserId,
          likes: updatedLikes,
        }
      },
      { new: true } // return latest
    );
    return await Todo.findOne({_id: updatedTodo._id}).populate('userId');
  } catch (e) {
    console.log(`FAILED to RENAME todo id ${todoId} = `, e);
    return null;
  }
}
export async function toggleTodoStatus(todoId, status, text) {
  try {
    const updatedTodo = await Todo.findOneAndUpdate(
      {
        _id: todoId
      },
      {
        $set: {
          complete: !status
        }
      },
      {
        new: true
      }
    );
    return updatedTodo;
  } catch (e) {
    console.log(`FAILED to TOGGLE TODO id ${todoId} = `, e);
    return null;
  }
}

export async function removeTodo(id, text) {
  try {
    await Todo.remove({ id });
    return id;
  } catch (e) {
    console.log(`FAILED to REMOVE TODO id ${id} = `, e);
    return null;
  }
}