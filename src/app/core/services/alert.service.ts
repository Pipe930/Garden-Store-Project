import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  public success(title: string, text: string):void{

    Swal.fire({
      title: title,
      text: text,
      icon: "success",
      timer: 5000
    })
  }

  public error(title: string, text: string):void{

    Swal.fire({
      title: title,
      text: text,
      icon: "error",
      timer: 5000
    })
  }

  public info(title: string, text: string):void {

    Swal.fire({

      title: title,
      text: text,
      icon: "info",
      timer: 5000
    })
  }

  public toastSuccess(title: string):void{


    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 5000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });

    Toast.fire({
      icon: "success",
      title: title
    });

  }
}
