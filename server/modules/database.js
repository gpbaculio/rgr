import {Todo, User} from './models/Todo';

export async function createTodo(text, userId) {
  try {
    const newTodo = new Todo({ text, userId });
    await newTodo.save();
  } catch (e) {
    console.log(`FAILED to CREATE TODO ${text} = `, e)
  }
}

export async function registerUser(displayName, email, password) {
  try {
    const newUser = new User({ displayName, email, password });
    await newUser.save();
  } catch (e) {
    console.log(`FAILED to REGISTER USER ${displayName} = `, e)
  }
}

export async function getTodo(todoId) {
  try {
    const todo = await Todo
      .findOne({ id: todoId })
      .populate('userId');
    return todo;
  } catch (e) {
    console.log(`FAILED to RETRIEVE TODO id ${todoId} = `, e)
  }
}

export async function getUser(userId) {
  try {
    const user = await User.findById({id: userId})
    return user;
  } catch (e) {
    console.log(`FAILED to RETRIEVE USER id ${userId} = `, e)
  }
}

export async function renameTodo(todoId, text, prevText) {
  try {
    const updatedTodo = await Todo.findOneAndUpdate(
      {
        _id: todoId
      }, {
        $set: {
          text: text
        }
      }, {
        new: true
      }
    );
    return updatedTodo;
  } catch (e) {
    console.log(`FAILED to RENAME todo id ${todoId} = `, e)
  }
}

export async function toggleTodoStatus(todoId, status, text) {
  try {
    const updatedTodo = await Todo.findOneAndUpdate(
      {
        _id: todoId
      }, {
        $set: {
          complete: !status
        }
      }, {
        new: true
      }
    );
    return updatedTodo;
  } catch (e) {
    console.log(`FAILED to TOGGLE TODO id ${todoId} = `, e)
  }
}

export async function removeTodo(id, text) {
  try {
    await Todo.remove({ id });
    return id;
  } catch (e) {
    console.log(`FAILED to REMOVE TODO id ${id} = `, e);
  }
}