import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { injectMutation, injectQuery } from 'convex-angular';

import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';

@Component({
  imports: [FormsModule],
  selector: 'cva-todo-list',
  templateUrl: 'todo-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
})
export default class TodoList {
  readonly count = model(3);

  readonly todos = injectQuery(api.todos.listTodos, () => ({
    count: this.count(),
  }));

  readonly completeTodo = injectMutation(api.todos.completeTodo);
  readonly reopenTodo = injectMutation(api.todos.reopenTodo);

  handleTodoChange(id: Id<'todos'>, completed: boolean) {
    if (completed) {
      this.reopenTodo.mutate({ id });
    } else {
      this.completeTodo.mutate({ id });
    }
  }
}
