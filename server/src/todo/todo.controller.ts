import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UsePipes,
  ValidationPipe,
  Patch,
  Query,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { BasePaginationRequestDto } from './dto/base-pagination-request.dto';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  getAllTodos(@Query() query: BasePaginationRequestDto) {
    return this.todoService.getAll(query);
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  addTodo(@Body() createTodoDto: CreateTodoDto) {
    return this.todoService.addTodo(createTodoDto.text, createTodoDto.ready);
  }

  @Patch()
  updateTodo(@Body() createTodoDto: Partial<CreateTodoDto>) {
    return this.todoService.update(createTodoDto);
  }

  @Delete(':id')
  deleteTodo(@Param('id') id: string) {
    return this.todoService.deleteTodo(Number(id));
  }

  @Delete('clear/all')
  clearAll() {
    return this.todoService.clearAll();
  }
}
