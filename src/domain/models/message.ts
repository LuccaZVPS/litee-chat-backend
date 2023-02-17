export interface Message {
  _id: string;
  text: string;
  //O primeiro indice da lista é quem envia a mensagem
  accounts: string[];
  createdAt: Date;
}
