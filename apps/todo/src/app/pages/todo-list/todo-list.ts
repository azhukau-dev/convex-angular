import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { injectQuery } from 'convex-angular';

import { api } from '../../../convex/_generated/api';

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
}
