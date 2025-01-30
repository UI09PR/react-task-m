import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './entity/todo.entity';
import { BasePaginationRequestDto } from './dto/base-pagination-request.dto';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Todo)
    private todoRepository: Repository<Todo>,
  ) {}

  async getAll(
    query: BasePaginationRequestDto,
  ): Promise<{ data: Todo[]; count: number }> {
    const limit = query.limit ? parseInt(query.limit, 10) : 10;
    const page = query.page ? parseInt(query.page, 10) : 1;
    const skip = (page - 1) * limit;

    const data = await this.todoRepository.find({
      take: limit,
      skip: skip,
    });

    const count = await this.todoRepository.count();

    return { data, count };
  }

  async addTodo(text: string, ready: boolean): Promise<Todo> {
    const newTodo = this.todoRepository.create({ text, ready });
    return this.todoRepository.save(newTodo);
  }

  async update(newTodo: Partial<Todo>): Promise<Todo> {
    const todo = await this.todoRepository.findOneBy({ id: newTodo.id });
    if (!newTodo) throw new HttpException('entity not found', 404);
    return this.todoRepository.save({ ...todo, ...newTodo });
  }

  async deleteTodo(id: number): Promise<boolean> {
    const result = await this.todoRepository.delete(id);
    return result.affected > 0;
  }

  async clearAll() {
    return await this.todoRepository.clear();
  }
}
