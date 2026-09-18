import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export const MessageBox = (props:any) => {
    if(props.type==="success"){
        MySwal.fire({
          title: <strong>{props.title}</strong>,
          html: <i>{props.message}</i>,
          icon: 'success',
          width:'30%',
          confirmButtonText: 'Ok'
        });
    }else if(props.type==="error"){
        MySwal.fire({
          title: <strong>{props.title}</strong>,
          html: <i>{props.message}</i>,
          icon: 'error',
          confirmButtonText: 'Ok'
        });
    }
}
