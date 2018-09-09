import { FieldModel } from './field.model';

export class EntityModel {
  constructor(
  public id_subject: number,
  public id_object: number,
  public id_action: number,
  public name: string,
  public access: number,
  public items: Array<FieldModel[]>
  ) {}
}
