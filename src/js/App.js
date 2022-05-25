import { ajax } from 'rxjs/ajax';
import { pluck, timer, switchMap } from 'rxjs';
import moment from 'moment-timezone';

export default class App {
  init() {
    this.fetchUnreadMessages();
  }

  fetchUnreadMessages() {
    timer(0, 1000)
      .pipe(
        switchMap(() => ajax.getJSON('https://polling-be.herokuapp.com/messages/unread')),
        pluck('messages'),
      )
      .subscribe((x) => {
        if (JSON.stringify(x) !== this.oldMessages) {
          App.renderMessages(x);
        }
        this.oldMessages = JSON.stringify(x);
      });
  }

  static renderMessages(array) {
    const table = document.getElementById('table');
    array.forEach((x) => {
      const tr = document.createElement('tr');
      const email = document.createElement('td');
      const msg = document.createElement('td');
      const date = document.createElement('td');
      email.innerText = x.from;
      if (x.subject.length > 15) msg.innerText = `${x.subject.slice(0, 15)}...`;
      else msg.innerText = x.subject;
      date.innerText = moment(x.received).format('kk:mm DD.MM.YYYY');
      tr.append(email);
      tr.append(msg);
      tr.append(date);
      table.prepend(tr);
    });
  }
}
