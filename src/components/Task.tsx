import type { Task as TaskT } from '../types/dataSchemas';

export default function Task({ task }: { task: TaskT }) {
  return (
    <div id={task.id}>
      <p>{task.name}</p>
      <p>
        completed:
        {JSON.stringify(task.completed)}
      </p>
    </div>
  );
}
