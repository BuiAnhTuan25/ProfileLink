import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../_service/auth-service/authentication.service';

@Component({
  selector: 'app-register-verify',
  templateUrl: './register-verify.component.html',
  styleUrls: ['./register-verify.component.css']
})
export class RegisterVerifyComponent implements OnInit {
  success:boolean=false;
  code:string='';
  constructor(private auth:AuthenticationService,private route:ActivatedRoute, private router:Router) { }

  ngOnInit(): void {
    this.code = this.route.snapshot.paramMap.get('code')!;
    console.log(this.code);
    if(this.code){
      this.registerVerify(this.code);
    } else this.success=false;
  }
  
  registerVerify(code:string){
    this.auth.registerVeryfy(code).subscribe((res:any)=>{
      console.log(res)
      if(res.success){
        this.success=true;
      } else this.success=false;
    })
  }

  login(){
  this.router.navigate(['/login']);
  }

  register(){
    this.router.navigate(['/register']);
    }
}
