import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2'
import { ApiRestProvider } from 'src/providers/api-rest/api-rest';
import { NgxSpinnerService } from "ngx-spinner";  
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


//Componente principal de la aplicacion encargado de validaciones de formulario y logica de la vista
export class AppComponent {
  title = 'angular-login';

  user: FormGroup;

  constructor(public apiService: ApiRestProvider,private spinnerService: NgxSpinnerService) {
  }

  //Metodo de carga inicial encargado de iniciar el formulario y sus validadores

  ngOnInit() {
    this.user = new FormGroup({
      id: new FormControl('', [Validators.required]),
      pw: new FormControl('', Validators.required),
    });
  }

  //Metodo encargado de enviar la solicitud al servicio rest o mostrar mensajes de error si es el caso

  onSubmit() {
    if (this.user.valid) {
      this.spinnerService.show();
      let json={
        "pw":this.user.get("pw").value,
        "id":this.user.get("id").value
      }

      this.sendParams(json);
    } else {
      Swal.fire({
        title: 'Error!',
        text: 'Debes completar todos los campos',
        icon: 'error',
        confirmButtonText: 'Continuar'
      })
    }
  }


  sendParams(body){
    this.apiService.post("login",body).then(result => {
      this.spinnerService.hide();
      if (result.session === '') {
        Swal.fire({
          title: 'Error!',
          text: 'Credenciales incorrectas',
          icon: 'error',
          confirmButtonText: 'Continuar'
        })
      } else {
        Swal.fire({
          title: 'Tu sesion es '.concat(result.session),
          width: 600,
          padding: '3em',
          background: '#fff',
          backdrop: `
            rgba(0,0,123,0.4)             
            left top
            no-repeat
          `
        })
      }
    }).catch(error => {
      console.log(error);
      this.spinnerService.hide();
      if (error.message === 'Timeout has occurred') {
        Swal.fire({
          title: 'Error!',
          text: 'La conexion ha fallado, intentelo de nuevo',
          icon: 'error',
          confirmButtonText: 'Continuar'
        })
      }else{
        Swal.fire({
          title: 'Error!',
          text: 'Error en el servidor',
          icon: 'error',
          confirmButtonText: 'Continuar'
        })        
      }
    })

    this.user.reset();
  }
}
