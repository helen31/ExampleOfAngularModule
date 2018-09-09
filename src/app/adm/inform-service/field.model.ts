export class FieldModel {
  constructor(
    public id_subject: number,
    public id_object: number,
    public id_action: number, //todo change to another property name
    public name: string,
    public access: number
  ) {}
}
