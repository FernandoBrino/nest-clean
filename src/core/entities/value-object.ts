import { UniqueEntityId } from "./unique-entity-id";

export abstract class ValueObject<T> {
  protected props: T;

  protected constructor(props: T, id?: UniqueEntityId) {
    this.props = props;
  }

  public equals(vo: ValueObject<unknown>) {
    if (vo === null || vo === undefined) {
      return false;
    }
    
    if(vo.props === undefined) {
        return false;
    }

    // we need to compare in a primitive way, cause when you just compare two object
    // its going to compare the memory reference instead of the value
    return JSON.stringify(vo.props) === JSON.stringify(this.props);
  }
}
