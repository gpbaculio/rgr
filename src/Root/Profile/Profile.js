import React from 'react';
import {withRouter} from 'react-router';
import {v1} from 'uuid';
import {
  graphql,
  createPaginationContainer
} from 'react-relay';
import {ConnectionHandler} from 'relay-runtime';


import createTodoMutation from '../../mutations/createTodo';
import './style.css';

class Profile extends React.Component {

  state = {
    newTodoText: '',
  }

  _createTodo = (e) => {
    console.log('createTodo fired!');
    e.preventDefault();
    const { newTodoText: text } = this.state;
    const { viewer } = this.props;
    const { id: userId } = viewer; // userId is owner of the todo
    this.setState({ createClicked: true });
    const sharedUpdater = (store, viewer, newEdge) => {
      const userProxy = store.get(viewer.id);
      const conn = ConnectionHandler.getConnection(
        userProxy,
        'Profile_allTodosByViewer',
      );
      ConnectionHandler.insertEdgeBefore(conn, newEdge);
    }
    const mutation = createTodoMutation(
      { text, userId },
      {
        onSuccess: () => this.setState({ createClicked: false, newTodoText: '' }),
        onError: () => this.setState({ createClicked: false, newTodoText: '' }),
        updater: (store) => {
          const payload = store.getRootField('createTodo'); // payload from the mutation name
          const newEdge = payload.getLinkedRecord('todoEdge'); // the new todo added
          sharedUpdater(store, viewer, newEdge);
        },
        optimisticUpdater: (store) => {
          const id = `${v1()}`;
          const node = store.create(id, 'Todo');
            node.setValue(text, 'text');
            node.setValue(id, 'id');
            node.setValue(false, 'complete');
          const newEdge = store.create(
            `client:newEdge:${v1()}`,
            'TodoEdge',
          );
            newEdge.setLinkedRecord(node, 'node');
          sharedUpdater(store, viewer, newEdge);
        },
      },
    );
    mutation.commit()
    this.setState({ newTodoText: '' })
  }
  handleInputChange = e => this.setState({ newTodoText: e.target.value });
  render() {
    return (
      <div>
        {this.props.viewer.displayName}
        <form onSubmit={this._createTodo}>
          <input type="text" value={this.state.newTodoText} onChange={this.handleInputChange} />
        </form>
        <ul>
          {this.props.viewer.allTodosByViewer.edges.map(({node}) => (
            <li key={node.id}>
              1. title: {node.text} &nbsp; 
              2. complete: {`${node.complete}`}
            </li>
          ))}
        </ul>
      </div>
    )
  }

}

export default createPaginationContainer(
  withRouter(Profile), 
  graphql`fragment Profile_viewer on User {
    id
    displayName
    allTodosByViewer( first: $count after: $cursor ) @connection(key: "Profile_allTodosByViewer") {
      edges {
        node {
          text
          complete
          id
        }
      }
      pageInfo { # for pagination
        hasPreviousPage
        startCursor 
        hasNextPage
        endCursor 
      }
    }
  }
  `, 
  {
    getConnectionFromProps(props) {
      return props.viewer && props.viewer.allTodosByViewer;
    },
    getFragmentVariables(prevVars, totalCount) {
      return ({
        ...prevVars,
        count: totalCount
      });
    },
    getVariables(props, { count, cursor }, fragmentVariables) {
      return ({
        count,
        cursor
      });
    },
    query: graphql`
      query ProfileQuery(
        $count: Int! $cursor:String
      ) {
        viewer {
          ...Profile_viewer
        }
      }
    `
  }
);
