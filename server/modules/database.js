import Todo from './models/Todo';
import User from './models/User';

export async function createTodo(text, userId) {
  try {
    const newTodo = new Todo({ text, userId });
    await newTodo.save();
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

export async function getTodo(todoId) {
  try {
    const todo = await Todo.findOne({ id: todoId }).populate('userId');
    return todo;
  } catch (e) {
    console.log(`FAILED to RETRIEVE TODO id ${todoId} = `, e);
    return null;
  }
}

export async function getUser(userId) {
  try {
    const user = await User.findById({ id: userId });
    console.log('getUser found! = ', getUser);
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