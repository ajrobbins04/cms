export class Message {
  constructor(
    public id: string,
    public subject: string,
    public msgText: string,
    public sender: { name: string } // Shows the sender's name on the frontend
  ) {}
}

