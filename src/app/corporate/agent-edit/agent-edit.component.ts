import { Component, EventEmitter, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { CorporateService } from '../corporate.service';
import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { validateHeaderName } from 'http';
import { forkJoin, Observable, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { concatMap } from 'rxjs/operators';
import { SharedFunctionsService } from '../../shared-functions.service';
import { ActivatedRoute, Router } from '@angular/router';
import { KycModuleService } from '../../kyc/kyc/kyc-module.service';
@Component({
  selector: 'app-agent-edit',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './agent-edit.component.html',
  styleUrl: './agent-edit.component.css'
})
export class AgentEditComponent {
  @Output() cancel = new EventEmitter<void>();
  public corporateForm: FormGroup = new FormGroup({});
  public agentType1: FormControl = new FormControl('', [Validators.required,]);
  public submittedByFirst: FormControl = new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]);
  public submittedByLast: FormControl = new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]);
  public submittedByEmail: FormControl = new FormControl({ value: '', disabled: true }, [Validators.required]);
  public submittedByPhone: FormControl = new FormControl({ value: '', disabled: true }, [Validators.required, Validators.pattern(/.*(7\d{8})$/)]);
  public submittedByGender: FormControl = new FormControl('', [Validators.required,]);
  public submittedByUserName: FormControl = new FormControl('', [Validators.required,]);
  public submittedByPassword: FormControl = new FormControl('', [Validators.required,]);

  public accType: FormControl = new FormControl({ value: '', disabled: true });
  public basicFirstName: FormControl = new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9 -]+$')]);
  public basicLastName: FormControl = new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9 -]+$')]);
  public basicFatherName: FormControl = new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]);
  public basicwallet: FormControl = new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]);
  public idType: FormControl = new FormControl('', [Validators.required]);
  // public idNO: FormControl = new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]);
  // public passNO: FormControl = new FormControl('', [Validators.required, Validators.pattern('^[0-9!@#$%^&*()_+=\\-\\[\\]{};:"\'|,.<>?/]*$')]);
  public idNO: FormControl = new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]);
  public passNO: FormControl = new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9 !@#$%^&*()_+=\\-\\[\\]{};:"\'|,.<>?/]*$')]);

  public issueDate: FormControl = new FormControl('', [Validators.required, this.sharedFunctionsService.pastDateValidator()]);
  public expiryDate: FormControl = new FormControl('', [Validators.required, this.sharedFunctionsService.futureDateValidator()]);
  public pageNO: FormControl = new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]);
  public bookNO: FormControl = new FormControl('', [Validators.required]);
  public regNO: FormControl = new FormControl('', [Validators.required]);

  public dob: FormControl = new FormControl('', [this.ageValidator(), this.sharedFunctionsService.ageValidator()]);
  // public placeOfBirth: FormControl = new FormControl('', [Validators.required,  Validators.pattern('^[a-zA-Z0-9 ]+$')]);
  public country: FormControl = new FormControl('', [Validators.required]);
  public province: FormControl = new FormControl('', [Validators.required]);
  public genderInfo: FormControl = new FormControl('', [Validators.required]);
  public marital: FormControl = new FormControl('', [Validators.required]);
  public nationality: FormControl = new FormControl('', [Validators.required]);
  public basicPhone: FormControl = new FormControl({ value: '', disabled: true }, [Validators.required, Validators.pattern(/.*(7\d{8})$/)]);
  public basicEmail: FormControl = new FormControl({ value: '', disabled: true }, [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]);
  public accOpenDate: FormControl = new FormControl('', [Validators.required]);
  public PTID: FormControl = new FormControl('', [Validators.pattern('^[0-9]+$')]);
  public accPurpose: FormControl = new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]);
  public basicPassword: FormControl = new FormControl('', [Validators.required]);

  public firstName: FormControl = new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9 -]+$')]);
  public father: FormControl = new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]);
  public pos: FormControl = new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]);
  public last: FormControl = new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9 -]+$')]);
  public tazkira: FormControl = new FormControl('', [Validators.required]);
  public position: FormControl = new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]);
  public licenseNo: FormControl = new FormControl('', [Validators.required]);
  public ICCID: FormControl = new FormControl('', [Validators.required]);
  public incomeSource: FormControl = new FormControl('', [Validators.required]);
  public monthlyIncome: FormControl = new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]);
  public basicGender: FormControl = new FormControl('', [Validators.required]);
  public accountDate: FormControl = new FormControl('', [Validators.required]);
  // public basicEmail: FormControl = new FormControl('', [Validators.email, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]);

  public superType: FormControl = new FormControl('');
  public locationAddress: FormControl = new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]);
  public countryAddress: FormControl = new FormControl('', [Validators.required]);
  public provinceAddress: FormControl = new FormControl('', [Validators.required]);
  public districtAddress: FormControl = new FormControl('', [Validators.required]);
  public streetAddress: FormControl = new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]);
  public districtTextCur: FormControl = new FormControl('', [Validators.required]);
  public provinceTextCur: FormControl = new FormControl('', [Validators.required]);

  public permanentHouseNo: FormControl = new FormControl('', [Validators.required]);
  public permanentLocation: FormControl = new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]);
  public permanentCountry: FormControl = new FormControl('', [Validators.required]);
  public permanentProvince: FormControl = new FormControl('', [Validators.required]);
  public permanentDistrict: FormControl = new FormControl('', [Validators.required]);
  public permanentStreet: FormControl = new FormControl('', [Validators.required]);
  public provinceTextPer: FormControl = new FormControl('', [Validators.required]);
  public districtTextPer: FormControl = new FormControl('', [Validators.required]);

  public MMacc: FormControl = new FormControl('', [Validators.required]);

  public incomeSourceOrg: FormControl = new FormControl('');
  public ShopName: FormControl = new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]);
  public positionorg: FormControl = new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]);
  public natureOfBusiness: FormControl = new FormControl('', [Validators.pattern('^[0-9]+$')]);
  public address: FormControl = new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]);
  public monthlyIncomeorg: FormControl = new FormControl('', [Validators.required]);
  public activity: FormControl = new FormControl('', [Validators.required]);
  public TurnoverOrg: FormControl = new FormControl('', [Validators.required]);
  public tinOrg: FormControl = new FormControl('', [Validators.pattern('^[0-9]+$')]);
  public natureText: FormControl = new FormControl('', [Validators.pattern('^[a-zA-Z0-9 ]+$')]);
  public sourceText: FormControl = new FormControl('', [Validators.pattern('^[a-zA-Z0-9 ]+$')]);
  public accPurposeText: FormControl = new FormControl('', [Validators.pattern('^[a-zA-Z0-9 ]+$')]);

  public haveOtherAccounts: FormControl = new FormControl('');
  public EMIname: FormControl = new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]);
  public accountName: FormControl = new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]);
  public accountNo: FormControl = new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]);

  public fatherKin: FormControl = new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]);
  public nameKin: FormControl = new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]);
  public numberKin: FormControl = new FormControl('', [Validators.required, Validators.pattern(/.*(7\d{8})$/)]);
  public relationship: FormControl = new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]);
  public kinAddress: FormControl = new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]);
  public relationText: FormControl = new FormControl('', []);


  public proPic: FormControl = new FormControl('', [Validators.required]);
  public userSign: FormControl = new FormControl('', [Validators.required]);
  public digitalSign: FormControl = new FormControl('', [Validators.required]);
  public docfront: FormControl = new FormControl('', [Validators.required]);
  public docBack: FormControl = new FormControl('', [Validators.required]);
  public licenseSign: FormControl = new FormControl('', [Validators.required]);
  public addressProof: FormControl = new FormControl('', [Validators.required]);
  public tinLetter: FormControl = new FormControl('');

  showBasicInfo: boolean = true;
  showBusiness: boolean = false;
  showOrg: boolean = false
  showRemittance: boolean = false
  showCompanyPres: boolean = false
  showCompanyCurrent: boolean = false
  showCompanyPermanent: boolean = false;
  showCompanyVice: boolean = false;
  showCompanyViceCurrent: boolean = false;
  showCompanyVicePermanent: boolean = false;
  showMNO: boolean = false;
  showUndertaken: boolean = false;
  showDoc: boolean = false;
  showAbmmc: boolean = false;
  nationalities: any;
  provinces: any;
  districts: any;
  provinceId: any;
  selectedProvinceName: any;
  uploadedImage: any;
  uploadedImageSign: any;
  uploadedImagePres: any;
  uploadedImageVice: any;
  uploadedImageCom: any;
  uploadedImageOp: any;
  currentPage: number = 1;
  uploadedImageAuth: any;
  uploadedImageKyc: any;
  type!: string;
  photoId: any;
  uploadedImageUndertaken: any;
  uploadedImageFileName: any;
  uploadedImageFileType1: any;
  uploadedImageFileNameExtension: any;
  uploadedImageFileData: any;
  showCurDisText: boolean = true;
  showCurDisDrop: boolean = false;
  showCurProText: boolean = false;
  showCurProDrop: boolean = true;
  countryNameCur: any;
  showPerProDrop: boolean = true;
  showPerProText: boolean = false;
  showPerDisDrop: boolean = false;
  showPerDisText: boolean = true;
  countryNamePer: any;
  showPassword = false;
  submitterForId: any;
  EMIvalue: any;
  showEMIdetails: boolean = false;
  currentDate!: string;
  uploadedImageUser: any;
  uploadedImageDigSign: any;
  uploadedImageFileNameeDigSign: any;
  uploadedImageDocFront: any;
  uploadedImageFileNameDocFront: any;
  uploadedImageDocBack: any;
  uploadedImageFileNameDocBack: any;
  uploadedImageLicense: any;
  uploadedImageFileNameLicense: any;
  uploadedImageAddress: any;
  uploadedImageFileNameAddress: any;
  uploadedImageTin: any;
  uploadedImageFileNametin: any;
  accPurposeData: any;
  accPurposeTarget: any;
  natureOfBusinessData: any;
  natureOfBusinessTarget: any;
  incomeSourceTarget: any;
  incomeSourceData: any;
  formattedMonthlyIncomeorg: string = '';
  selectedFiles: File[] = [];
  additonalDoc: any;
  natureTextBox: boolean = false;
  sourceTextBox: boolean = false;
  accPurposeTextBox: boolean = true;
  showAccPurposeDrop: boolean = false;
  relationTextBox: boolean = true;
  uploadedFiles: File[] = [];
  uploadedProfilePicture: any;
  uploadedProfilePictureFileName: any;
  uploadedProfilePictureFileType: any;
  uploadedProfilePictureFileNameExtension: any;
  uploadedProfilePictureFileData: any;
  proPicError: string | null = null;
  selfieError: string | null = null;
  digSignError: string | null = null;
  docfrontError: string | null = null;
  docBackError: string | null = null;
  licenseSignError: string | null = null;
  addressProofError: string | null = null;
  nationalityAfghan: any;
  showIdExist: boolean = false;
  showPassExist: boolean = false;
  emailErrorReg: boolean = false;
  emailErrorBasic: boolean = false;
  phoneErrorReg: boolean = false;
  phoneErrorBasic: boolean = false;
  relationTarget: any;
  profileDetails: any;
  loginUser: any;
  loginDate: any;
  loginFullname: any;
  loginUsername: any;
  item: any;
  compSign: any;
  newComp: any;
  haveotherMno: any;
  agentPhoto: any;
  newFileProfile: any;
  tinLetterPhoto: any;
  agentSignaturePhoto: any;
  custProofFrontPhoto: any;
  custProofBackPhoto: any;
  bizOrGovtLicensePhoto: any;
  addressProofPhoto: any;
  isImageVisible: boolean = false;
  isDigitalSignVisible: boolean = false;
  isDocFrontVisible: boolean = false;
  isDocBackVisible: boolean = false;
  isLicenseVisible: boolean = false;
  isAddressProofVisible: boolean = false;
  isTINLetterVisible: boolean = false;
  tinLetterError: string | null = null;
  relationDrop: boolean = false;
  idValue: any;
  itemIncomplete: any;

  constructor(private corporate: CorporateService,
    private sharedFunctionsService: SharedFunctionsService,
    private router: Router, private KycService: KycModuleService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.KycService.getProfileDetails().subscribe((data: any) => {
      this.profileDetails = data?.data
      this.loginFullname = this.profileDetails?.firstName + ' ' + this.profileDetails?.lastName
      this.loginUsername = this.profileDetails?.username
      this.currentDate = today.toISOString().split('T')[0];
      this.loginDate = this.currentDate
      console.log("currentDate", this.currentDate)
    })
    this.item = this.KycService.getItem();
    console.log("this.item pending", this.item)
    this.submitterForId = this.item?.submittedFor?.id
    console.log("submitterForId", this.submitterForId)
    const today = new Date();
    this.currentDate = today.toISOString().split('T')[0];
    console.log("formattedDate", this.currentDate)
    this.initForm();
    this.corporateForm.get('monthlyIncomeorg')?.valueChanges.subscribe(value => {
      if (value) {
        const numericValue = value.replace(/[^0-9]/g, '');
        const formattedDisplay = `AFN ${parseInt(numericValue, 10).toLocaleString('en-US')}`;
        this.corporateForm.get('monthlyIncomeorg')?.setValue(formattedDisplay, { emitEvent: false });
      }
    });
    this.corporateForm.get('TurnoverOrg')?.valueChanges.subscribe(value => {
      if (value) {
        const numericValue = value.replace(/[^0-9]/g, '');
        const formattedDisplay = `AFN ${parseInt(numericValue, 10).toLocaleString('en-US')}`;
        this.corporateForm.get('TurnoverOrg')?.setValue(formattedDisplay, { emitEvent: false });
      }
    });
    this.getCountries();
    this.getCountriesNationality();
    this.getDistricts
    this.getProvinces();
    this.getNatureOfBusiness();
    this.getIncomeSource();
    this.getAccPurpose();
    this.setFormValues(this.item);
    if (this.item?.agentKyc) {
      const otherMnoFacility = this.item.agentKyc.otherMnoFacility ? 'TRUE' : 'FALSE';
      this.haveOtherAccounts.patchValue(otherMnoFacility);

      // const currDistrict = this.item.agentKyc.currDistrict || '';
      // this.districtAddress.patchValue(currDistrict);

      // const permDistrict = this.item.agentKyc.permDistrict || '';
      // this.permanentDistrict.patchValue(permDistrict);
    }
  }

  private initForm() {
    this.corporateForm.addControl('agentType1', this.agentType1);
    this.corporateForm.addControl('submittedByFirst', this.submittedByFirst);
    this.corporateForm.addControl('submittedByLast', this.submittedByLast);
    this.corporateForm.addControl('submittedByEmail', this.submittedByEmail);
    this.corporateForm.addControl('submittedByPhone', this.submittedByPhone);
    this.corporateForm.addControl('submittedByGender', this.submittedByGender);
    this.corporateForm.addControl('submittedByUserName', this.submittedByUserName);
    this.corporateForm.addControl('submittedByPassword', this.submittedByPassword);

    this.corporateForm.addControl('accType', this.accType);
    this.corporateForm.addControl('basicFirstName', this.basicFirstName);
    this.corporateForm.addControl('basicLastName', this.basicLastName);
    this.corporateForm.addControl('basicFatherName', this.basicFatherName);
    this.corporateForm.addControl('basicwallet', this.basicwallet);
    this.corporateForm.addControl('idType', this.idType);
    this.corporateForm.addControl('idNO', this.idNO);
    this.corporateForm.addControl('passNO', this.passNO);
    this.corporateForm.addControl('issueDate', this.issueDate);
    this.corporateForm.addControl('expiryDate', this.expiryDate);
    this.corporateForm.addControl('pageNO', this.pageNO);
    this.corporateForm.addControl('bookNO', this.bookNO);
    this.corporateForm.addControl('regNO', this.regNO);

    this.corporateForm.addControl('dob', this.dob);
    // this.corporateForm.addControl('placeOfBirth', this.placeOfBirth);
    this.corporateForm.addControl('country', this.country);
    this.corporateForm.addControl('province', this.province);
    this.corporateForm.addControl('genderInfo', this.genderInfo);
    this.corporateForm.addControl('marital', this.marital);
    this.corporateForm.addControl('nationality', this.nationality);

    this.corporateForm.addControl('basicPhone', this.basicPhone);
    this.corporateForm.addControl('basicEmail', this.basicEmail);
    this.corporateForm.addControl('accOpenDate', this.accOpenDate);
    this.corporateForm.addControl('PTID', this.PTID);
    this.corporateForm.addControl('accPurpose', this.accPurpose);
    this.corporateForm.addControl('basicPassword', this.basicPassword);


    this.corporateForm.addControl('firstName', this.firstName);
    this.corporateForm.addControl('father', this.father);
    this.corporateForm.addControl('pos', this.pos);
    this.corporateForm.addControl('last', this.last);
    this.corporateForm.addControl('tazkira', this.tazkira);
    this.corporateForm.addControl('position', this.position);

    this.corporateForm.addControl('licenseNo', this.licenseNo);
    this.corporateForm.addControl('ICCID', this.ICCID);
    this.corporateForm.addControl('expiryDate', this.expiryDate);
    this.corporateForm.addControl('incomeSource', this.incomeSource);
    this.corporateForm.addControl('PTID', this.PTID);
    this.corporateForm.addControl('monthlyIncome', this.monthlyIncome);
    this.corporateForm.addControl('basicGender', this.basicGender);
    this.corporateForm.addControl('accountDate', this.accountDate);
    this.corporateForm.addControl('basicEmail', this.basicEmail);

    this.corporateForm.addControl('locationAddress', this.locationAddress);
    this.corporateForm.addControl('provinceAddress', this.provinceAddress);
    this.corporateForm.addControl('streetAddress', this.streetAddress);
    this.corporateForm.addControl('districtAddress', this.districtAddress);
    this.corporateForm.addControl('countryAddress', this.countryAddress);
    this.corporateForm.addControl('districtTextCur', this.districtTextCur);
    this.corporateForm.addControl('provinceTextCur', this.provinceTextCur);

    this.corporateForm.addControl('permanentHouseNo', this.permanentHouseNo);
    this.corporateForm.addControl('permanentLocation', this.permanentLocation);
    this.corporateForm.addControl('permanentProvince', this.permanentProvince);
    this.corporateForm.addControl('permanentStreet', this.permanentStreet);
    this.corporateForm.addControl('permanentDistrict', this.permanentDistrict);
    this.corporateForm.addControl('permanentCountry', this.permanentCountry);
    this.corporateForm.addControl('provinceTextPer', this.provinceTextPer);
    this.corporateForm.addControl('districtTextPer', this.districtTextPer);

    this.corporateForm.addControl('MMacc', this.MMacc);

    this.corporateForm.addControl('incomeSourceOrg', this.incomeSourceOrg);
    this.corporateForm.addControl('ShopName', this.ShopName);
    this.corporateForm.addControl('positionorg', this.positionorg);
    this.corporateForm.addControl('natureOfBusiness', this.natureOfBusiness);
    this.corporateForm.addControl('address', this.address);
    this.corporateForm.addControl('monthlyIncomeorg', this.monthlyIncomeorg);
    this.corporateForm.addControl('activity', this.activity);
    this.corporateForm.addControl('TurnoverOrg', this.TurnoverOrg);
    this.corporateForm.addControl('tinOrg', this.tinOrg);
    this.corporateForm.addControl('natureText', this.natureText);
    this.corporateForm.addControl('sourceText', this.sourceText);
    this.corporateForm.addControl('accPurposeText', this.accPurposeText);

    this.corporateForm.addControl('haveOtherAccounts', this.haveOtherAccounts);
    this.corporateForm.addControl('EMIname', this.EMIname);
    this.corporateForm.addControl('accountName', this.accountName);
    this.corporateForm.addControl('accountNo', this.accountNo);

    this.corporateForm.addControl('fatherKin', this.fatherKin);
    this.corporateForm.addControl('nameKin', this.nameKin);
    this.corporateForm.addControl('numberKin', this.numberKin);
    this.corporateForm.addControl('relationship', this.relationship);
    this.corporateForm.addControl('kinAddress', this.kinAddress);
    this.corporateForm.addControl('relationText', this.relationText);

    //auth person
    // this.corporateForm.addControl('firstNameAuth', this.firstNameAuth);
    // this.corporateForm.addControl('lastNameAuth', this.lastNameAuth);
    // this.corporateForm.addControl('fatherNameAuth', this.fatherNameAuth);
    // this.corporateForm.addControl('positionAuth', this.positionAuth);
    // this.corporateForm.addControl('emailAuth', this.emailAuth);
    // this.corporateForm.addControl('tazkiraAuth', this.tazkiraAuth);
    // this.corporateForm.addControl('TinAuth', this.TinAuth);
    // this.corporateForm.addControl('dobAuth', this.dobAuth);
    // this.corporateForm.addControl('countryAuth', this.countryAuth);
    // this.corporateForm.addControl('incomeSourceAuth', this.incomeSourceAuth);
    // this.corporateForm.addControl('issueDateAuth', this.issueDateAuth);
    // this.corporateForm.addControl('DateofExpiryAuth', this.DateofExpiryAuth);
    // this.corporateForm.addControl('nationalityAuth', this.nationalityAuth);
    // this.corporateForm.addControl('monthlyIncomeAuth', this.monthlyIncomeAuth);
    // this.corporateForm.addControl('mobileAuth', this.mobileAuth);
    //auth person

    this.corporateForm.addControl('proPic', this.proPic);
    this.corporateForm.addControl('userSign', this.userSign);
    this.corporateForm.addControl('digitalSign', this.digitalSign);
    this.corporateForm.addControl('docfront', this.docfront);
    this.corporateForm.addControl('docBack', this.docBack);
    this.corporateForm.addControl('licenseSign', this.licenseSign);
    this.corporateForm.addControl('addressProof', this.addressProof);
    this.corporateForm.addControl('tinLetter', this.tinLetter);

  }
  setFormValues(data: any): void {
    this.corporateForm.patchValue({
      submittedByFirst: data.submittedFor?.firstName,
      submittedByLast: data.submittedFor?.lastName,
      submittedByEmail: data.submittedFor?.email,
      submittedByPhone: data.submittedFor?.phone,
      submittedByGender: data.submittedFor?.gender,
      submittedByUserName: data.submittedFor?.custProofType,
      accType: data.agentKyc?.accountType,
      basicFirstName: data.agentKyc?.custInfoFirstName,
      basicLastName: data.agentKyc?.custInfoLastName,
      basicFatherName: data.agentKyc?.custInfoFatherName,
      idType: data.agentKyc?.custProofType,
      idNO: data.agentKyc?.custProofNumber,
      issueDate: data.agentKyc?.custProofDateOfIssue,
      expiryDate: data.agentKyc?.custProofDateOfExpiry,
      pageNO: data.agentKyc?.tazkiraPageNo,
      bookNO: data.agentKyc?.tazkiraBookNo,
      regNO: data.agentKyc?.tazkiraRegNo,
      dob: data.agentKyc?.custInfoDob,
      country: data.agentKyc?.custInfoBirthCountry,
      province: data.agentKyc?.custInfoBirthProvince,
      genderInfo: data.agentKyc?.custInfoGender,
      marital: data.agentKyc?.custInfoMaritalStatus,

      nationality: data.agentKyc?.custInfoNationality,
      basicPhone: data.agentKyc?.custInfoPhoneNumber,
      basicEmail: data.agentKyc?.custInfoEmail,
      PTID: data.agentKyc?.custInfoPTID,
      accPurposeText: data.agentKyc?.custInfoPurposeOfAcc,

      locationAddress: data.agentKyc?.currLocation,
      countryAddress: data.agentKyc?.currCountry,
      provinceAddress: data.agentKyc?.currProvince,
      districtTextCur: data.agentKyc?.currDistrict,
      streetAddress: data.agentKyc?.currStreet,

      permanentCountry: data.agentKyc?.permCountry,
      permanentProvince: data.agentKyc?.permProvince,
      districtTextPer: data.agentKyc?.permDistrict,

      incomeSourceOrg: data.agentKyc?.orgSourceOfIncome,
      ShopName: data.agentKyc?.orgName,
      positionorg: data.agentKyc?.orgPositionHeld,
      address: data.agentKyc?.orgAddress,
      monthlyIncomeorg: data.agentKyc?.orgMonthlyIncome,
      TurnoverOrg: data.agentKyc?.orgTurnover,
      natureOfBusiness: data.agentKyc?.orgBizNature,
      tinOrg: data.agentKyc?.orgTinNumber,

      haveOtherAccounts: data.agentKyc?.otherMnoFacility,
      EMIname: data.agentKyc?.otherMnoName,
      accountName: data.agentKyc?.otherMnoAccName,
      accountNo: data.agentKyc?.otherMnoAccNo,

      nameKin: data.agentKyc?.nokName,
      fatherKin: data.agentKyc?.nokFatherName,
      numberKin: data.agentKyc?.nokPhone,
      relationText: data.agentKyc?.nokRelationship,
      kinAddress: data.agentKyc?.nokLocation,

    })
    console.log('CurrDistrict val:', data.agentKyc?.currDistrict);
    console.log('permDistrict val:', data.agentKyc?.permDistrict);

    this.agentPhoto = data?.agentKyc?.agentPhoto;
    this.getImages(this.agentPhoto)
    console.log("agentPhoto", this.agentPhoto)

    this.agentSignaturePhoto = data?.agentKyc?.agentSignaturePhoto;
    this.getImagesAgentSign(this.agentSignaturePhoto)

    this.custProofFrontPhoto = data?.agentKyc?.custProofFrontPhoto;
    this.getImagesCustProofFrontPhoto(this.custProofFrontPhoto)

    this.custProofBackPhoto = data?.agentKyc?.custProofBackPhoto;
    this.getImagesCustProofBackPhoto(this.custProofBackPhoto)

    this.bizOrGovtLicensePhoto = data?.agentKyc?.bizOrGovtLicensePhoto;
    this.getImagesBizOrGovtLicensePhoto(this.bizOrGovtLicensePhoto)

    this.addressProofPhoto = data?.agentKyc?.addressProofPhoto;
    this.getImagesAddressProofPhoto(this.addressProofPhoto)

    this.tinLetterPhoto = data?.agentKyc?.tinLetterPhoto;
    this.getImagesTinLetterPhoto(this.tinLetterPhoto)

    this.haveotherMno = data.agentKyc?.otherMnoFacility
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  sanitizeInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    inputElement.value = inputElement.value.replace(/[^0-9]/g, '');
    this.corporateForm.get('idNO')?.setValue(inputElement.value);
  }
  toggleAddressProofVisibility() {
    this.isAddressProofVisible = !this.isAddressProofVisible; // Toggle visibility
  }
  toggleDocBackVisibility() {
    this.isDocBackVisible = !this.isDocBackVisible; // Toggle visibility
  }
  toggleTINLetterVisibility() {
    this.isTINLetterVisible = !this.isTINLetterVisible; // Toggle visibility
  }
  toggleLicenseVisibility() {
    this.isLicenseVisible = !this.isLicenseVisible; // Toggle visibility
  }
  toggleImageVisibility(): void {
    this.isImageVisible = !this.isImageVisible;
  }
  toggleDigitalSignVisibility() {
    this.isDigitalSignVisible = !this.isDigitalSignVisible; // Toggle visibility
  }
  toggleDocFrontVisibility() {
    this.isDocFrontVisible = !this.isDocFrontVisible;
  }

  getImages(imgParam: any) {
    this.KycService.getImage(imgParam).subscribe((res) => {
      console.log(res);
      const objectURL = URL.createObjectURL(res);
      this.agentPhoto = objectURL;
    })
  }
  getImagesAgentSign(imgParam: any) {
    this.KycService.getImage(imgParam).subscribe((res) => {
      console.log(res);
      const objectURL = URL.createObjectURL(res);
      this.agentSignaturePhoto = objectURL;
    })
  }
  getImagesCustProofFrontPhoto(imgParam: any) {
    this.KycService.getImage(imgParam).subscribe((res) => {
      console.log(res);
      const objectURL = URL.createObjectURL(res);
      this.custProofFrontPhoto = objectURL;
    })
  }
  getImagesCustProofBackPhoto(imgParam: any) {
    this.KycService.getImage(imgParam).subscribe((res) => {
      console.log(res);
      const objectURL = URL.createObjectURL(res);
      this.custProofBackPhoto = objectURL;
    })
  }
  getImagesBizOrGovtLicensePhoto(imgParam: any) {
    this.KycService.getImage(imgParam).subscribe((res) => {
      console.log(res);
      const objectURL = URL.createObjectURL(res);
      this.bizOrGovtLicensePhoto = objectURL;
    })
  }
  getImagesAddressProofPhoto(imgParam: any) {
    this.KycService.getImage(imgParam).subscribe((res) => {
      console.log(res);
      const objectURL = URL.createObjectURL(res);
      this.addressProofPhoto = objectURL;
    })
  }

  getImagesTinLetterPhoto(imgParam: any) {
    this.KycService.getImage(imgParam).subscribe((res) => {
      console.log(res);
      const objectURL = URL.createObjectURL(res);
      this.tinLetterPhoto = objectURL;
    })
  }
  ageValidator(): (control: AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // Don't validate empty values
      }
      const today = new Date();
      const birthDate = new Date(control.value);
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();
      const isUnderage = age < 18 || (age === 18 && monthDifference < 0);
      return isUnderage ? { underage: { value: control.value } } : null;
    };


  }
  onChangeCountryCur($event: any) {
    this.countryNameCur = $event.target.value
    if (this.countryNameCur === 'Afghanistan') {
      this.showCurProText = false
      this.showCurDisText = false
      this.showCurDisDrop = true
      this.showCurProDrop = true

    }
    else {
      this.showCurProText = true
      this.showCurDisText = true
      this.showCurDisDrop = false
      this.showCurProDrop = false
    }
  }
  onClickCurrDistrict() {
    alert("Please select a province");
    this.showCurDisDrop = true
    this.showCurDisText = false
  }
  onClickRelation() {
    this.relationDrop = true
    this.relationTextBox = false
  }
  onChangeCountryPer($event: any) {
    this.countryNamePer = $event.target.value
    if (this.countryNamePer === 'Afghanistan') {
      this.showPerProText = false
      this.showPerDisText = false
      this.showPerProDrop = true
      this.showPerDisDrop = true
    }
    else {
      this.showPerProText = true
      this.showPerDisText = true
      this.showPerProDrop = false
      this.showPerDisDrop = false
    }
  }
  onClickPerDistrict() {
    alert("Please select a province");
    this.showPerDisDrop = true
    this.showPerDisText = false
  }
  onSelectEMI($event: any) {
    this.EMIvalue = $event.target.value
    if (this.EMIvalue == "TRUE") {
      this.showEMIdetails = true
    }
    else {
      this.showEMIdetails = false
    }
  }

  //new
  isCurrentPageValid(): boolean {
    switch (this.currentPage) {
      case 1:
        return this.agentType1.value &&
          this.submittedByEmail.value &&
          this.submittedByUserName.value &&
          this.submittedByFirst.value &&
          this.submittedByLast.value &&
          this.submittedByPhone.value &&
          this.submittedByGender.value &&
          this.submittedByPassword.value;
      case 2:
        if (this.corporateForm.get('idType')?.value == "PASSPORT") {
          this.idValue = this.passNO.value
          console.log("idValue", this.idValue)
        }
        else if (this.corporateForm.get('idType')?.value == "E_TAZKIRA" ||
          this.corporateForm.get('idType')?.value == "PAPER_TAZKIRA") {
          this.idValue = this.idNO.value
          console.log("idValue1", this.idValue)
        }
        return this.accType.value &&
          this.basicFirstName.value &&
          this.basicLastName.value &&
          this.basicFatherName.value &&
          this.idType.value &&
          this.idValue &&
          this.dob.value &&
          this.country.value &&
          this.province.value &&
          this.genderInfo.value &&
          this.marital.value &&
          this.nationality.value &&
          this.basicPhone.value &&
          this.basicEmail.value &&
          this.accPurposeTarget;
      case 3:
        const provinceCurIsValid = this.showCurProDrop ? this.corporateForm.get('provinceAddress')?.value : this.corporateForm.get('provinceText')?.value;
        const districtCurIsValid = this.showCurDisDrop ? this.corporateForm.get('districtAddress')?.value : this.corporateForm.get('showCurDisText')?.value;
        return this.locationAddress.value &&
          this.countryAddress.value &&
          provinceCurIsValid &&
          districtCurIsValid;
      case 4:
        const provincePerIsValid = this.showPerProDrop ? this.permanentProvince.value : this.provinceTextPer.value;
        const districtPerIsValid = this.showPerDisDrop ? this.permanentDistrict.value : this.districtTextPer.value;
        return provincePerIsValid &&
          districtPerIsValid &&
          this.permanentCountry.value;
      case 5:
        //  this.incomeSourceOrg.value 
        // this.natureOfBusiness.value 
        return this.incomeSourceTarget &&
          this.ShopName.value &&
          this.positionorg.value &&
          this.address.value &&
          this.natureOfBusinessTarget &&
          this.monthlyIncomeorg.value &&
          this.TurnoverOrg.value

      case 6:
        if (this.EMIvalue == "TRUE") {
          return this.EMIname.value &&
            this.accountName.value &&
            this.accountNo.value;
        }
        else {
          return this.haveOtherAccounts.value;
        }
      case 7:
        return this.userSign.value &&
          this.digitalSign.value &&
          this.docfront.value &&
          this.docBack.value &&
          this.licenseSign.value &&
          this.addressProof.value;

      case 8:
        return this.nameKin.value &&
          this.fatherKin.value &&
          this.numberKin.value &&
          this.relationship.value &&
          this.kinAddress.value;

      // this.nameUndertaken.value &&
      //   this.dateUndertaken.value;
      // this.issueDate.value &&
      // this.expiryDate.value;
      default:
        return false;
    }
  }
  //new
  nextPage() {
    // this.selectedProvinceName = this.item.agentKyc?.currProvince
    // console.error('selectedProvinceName!', this.selectedProvinceName);
    // if (this.selectedProvinceName) {
    //   this.getDistricts(this.selectedProvinceName);
    // } else {
    //   console.error('No province selected!');
    // }

    // switch (this.currentPage) {
    //   case 1:
    //     this.callBasicAPI();
    //     break;
    //   case 2:
    //     this.callAgentRegisterAPI();
    //     break;
    //   case 3:
    //     this.callCurrentAPI();
    //     break;
    //   case 4:
    //     this.callPermAPI();
    //     break;
    //   case 5:
    //     this.callOrgAPI();
    //     break;
    //   case 6:
    //     this.callEmiAPI();
    //     break;
    //   case 7:
    //     this.callDocUploadAPI(); // Call submit only when on the final page
    //     break;
    //   case 8:
    //     this.submit();
    //     console.log("submit() called");
    //     return; // Prevent incrementing beyond page 8
    // }
    this.currentPage++;
  }

  previousPage() {
    if (this.currentPage !== 1) {
      this.currentPage--;
    }
  }
  onChangeAccPurpose($event: any) {
    this.accPurposeTarget = $event.target.value
    console.log("this.accPurposeTarget", this.accPurposeTarget)
    this.accPurposeTextBox = this.accPurposeTarget === "Others";  // Show textbox if "Others" is selected
    console.log("accPurposeTextBox", this.accPurposeTextBox)
  }
  onChangeRelation($event: any) {
    this.relationTarget = $event.target.value
    console.log("this.accPurposeTarget", this.relationTarget)
    this.relationTextBox = this.relationTarget === "Other";  // Show textbox if "Others" is selected
  }
  getAccPurpose() {
    this.corporate.getAccPurpose().subscribe({
      next: (data: any) => {
        this.accPurposeData = data?.data;
      }
    });
  }
  onChangeNatureOfBusiness($event: any) {
    this.natureOfBusinessTarget = $event.target.value
    this.natureTextBox = this.natureOfBusinessTarget === "Other";  // Show textbox if "Others" is selected
    console.log('Selected value:', this.natureOfBusinessTarget);  // Debugging line to check value
    console.log('natureTextBox value:', this.natureTextBox);
  }
  // onChangeNatureOfBusiness(event: Event): void {
  //   const selectedValue = (event.target as HTMLSelectElement).value;
  //   this.natureTextBox = selectedValue === "Other";  // Show textbox if "Others" is selected
  //   console.log('Selected value:', selectedValue);  // Debugging line to check value
  //   console.log('natureTextBox value:', this.natureTextBox);

  // }
  getNatureOfBusiness() {
    this.corporate.getNatureOfBusiness().subscribe({
      next: (data: any) => {
        this.natureOfBusinessData = data?.data;
      }
    });
  }
  onChangeincomeSource($event: any) {
    this.incomeSourceTarget = $event.target.value
    console.log("this.incomeSourceTarget", this.incomeSourceTarget)
    this.sourceTextBox = this.incomeSourceTarget === "Others";
    console.log("sourceTextBox", this.sourceTextBox)
  }
  getIncomeSource() {
    this.corporate.getIncomeSource().subscribe({
      next: (data: any) => {
        this.incomeSourceData = data?.data;
      }
    });
  }
  getCountries() {
    this.corporate.getCountries().subscribe({
      next: (data: any) => {
        this.nationalities = data?.data;
      }
    });
  }

  getCountriesNationality() {
    this.corporate.getCountries().subscribe({
      next: (data: any) => {
        this.nationalityAfghan = data?.data?.map((country: any) => {
          if (country.name === 'Afghanistan') {
            return { ...country, name: 'Afghan' };
          }
          return country;
        });
      },
      error: (err) => {
        console.error('Error fetching countries:', err);
      }
    });
  }


  getProvinces() {
    this.corporate.getprovinces().subscribe({
      next: (data: any) => {
        this.provinces = data?.data;
      }
    });
  }
  onSelectProvince($event: any) {
    this.provinceId = $event.target.value;
    const filteredProvinces = this.provinces.filter((province: any) => province.name === this.provinceId);
    if (filteredProvinces && filteredProvinces.length > 0) {
      this.selectedProvinceName = filteredProvinces[0].id;
    }
    this.getDistricts(this.selectedProvinceName);
  }
  getDistricts(provinceId: number) {
    this.corporate.getdistricts(provinceId).subscribe({
      next: (data: any) => {
        this.districts = data?.data;
      }
    });
  }
  onClickAccPurpose() {
    this.showAccPurposeDrop = true
    this.accPurposeTextBox = false
  }
  detectFilesPhoto(event: any) {
    // if (event.target.files && event.target.files[0]) {
    //   this.uploadedImage = event.target.files[0];
    //   this.uploadedImageFile0 = event.target.files[0].name;
    //   this.uploadedImageFileType0 = event.target.files[0].type
    //   this.uploadedImageFileNameExtension0 = event.target.files[0].name.split('.').pop();
    //   const file = event.target.files[0];
    //   const reader = new FileReader();
    //   reader.readAsDataURL(file);
    //   this.uploadedImageFileData0 = reader.result;
    //   reader.onload = () => {
    //     this.uploadedImageFileData0 = reader.result;
    //   };
    // }
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.uploadedImage = input.files[0];
      // Handle file upload here
      // For example, you can use a service to upload the file and update `agentImg`
      console.log(this.uploadedImage);
    }

  }
  detectFilesProfilePicture(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

      // Check file type
      if (!allowedTypes.includes(file.type)) {
        this.proPicError = 'Only image files (JPEG, PNG, JPG) are allowed.';
        this.corporateForm.get('proPic')?.setValue(null); // Clear the invalid file
      } else {
        this.proPicError = null; // Clear any previous error
        // You can proceed to handle the file
        console.log('File is valid:', file);
      }
    }
    if (event.target.files && event.target.files[0]) {
      this.uploadedProfilePicture = event.target.files[0];
      // console.log("uploadedImage1", this.uploadedImage1);
      this.uploadedProfilePictureFileName = event.target.files[0].name;
      this.uploadedProfilePictureFileType = event.target.files[0].type
      this.uploadedProfilePictureFileNameExtension = event.target.files[0].name.split('.').pop();
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      this.uploadedProfilePictureFileData = reader.result;
      reader.onload = () => {
        this.uploadedProfilePictureFileData = reader.result;
      };
    }
    // this.corporate.addAgentPhoto(this.uploadedImageUser, "agentPhoto", this.submitterForId).subscribe((data: any) => {
    // })
  }
  detectFilesUserPhoto(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

      // Check file type
      if (!allowedTypes.includes(file.type)) {
        this.selfieError = 'Only image files (JPEG, PNG, JPG) are allowed.';
        this.corporateForm.get('userSign')?.setValue(null); // Clear the invalid file
      } else {
        this.selfieError = null; // Clear any previous error
        // You can proceed to handle the file
        console.log('File is valid:', file);
      }
    }
    if (event.target.files && event.target.files[0]) {
      this.uploadedImageUser = event.target.files[0];
      // console.log("uploadedImage1", this.uploadedImage1);
      this.uploadedImageFileName = event.target.files[0].name;
      this.uploadedImageFileType1 = event.target.files[0].type
      this.uploadedImageFileNameExtension = event.target.files[0].name.split('.').pop();
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      this.uploadedImageFileData = reader.result;
      reader.onload = () => {
        this.uploadedImageFileData = reader.result;
      };
    }
    // this.corporate.addAgentPhoto(this.uploadedImageUser, "agentPhoto", this.submitterForId).subscribe((data: any) => {
    // })
  }
  detectFilesSign(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

      // Check file type
      if (!allowedTypes.includes(file.type)) {
        this.digSignError = 'Only image files (JPEG, PNG, JPG) are allowed.';
        this.corporateForm.get('digitalSign')?.setValue(null); // Clear the invalid file
      } else {
        this.digSignError = null; // Clear any previous error
        // You can proceed to handle the file
        console.log('File is valid:', file);
      }
    }
    if (event.target.files && event.target.files[0]) {
      this.uploadedImageDigSign = event.target.files[0];
      this.uploadedImageFileNameeDigSign = event.target.files[0].name;
    }
    // this.corporate.addAgentDigSign(this.uploadedImageDigSign, "agentSignaturePhoto", this.submitterForId).subscribe((data: any) => {

    // });
  }
  detectFilesDocFront(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

      // Check file type
      if (!allowedTypes.includes(file.type)) {
        this.docfrontError = 'Only image files (JPEG, PNG, JPG) are allowed.';
        this.corporateForm.get('docfront')?.setValue(null); // Clear the invalid file
      } else {
        this.docfrontError = null; // Clear any previous error
        // You can proceed to handle the file
        console.log('File is valid:', file);
      }
    }
    if (event.target.files && event.target.files[0]) {
      this.uploadedImageDocFront = event.target.files[0];
      this.uploadedImageFileNameDocFront = event.target.files[0].name;
    }
    // this.corporate.addAgentDocFront(this.uploadedImageDocFront, "custProofFrontPhoto", this.submitterForId).subscribe((data: any) => {
    // })
  }
  detectFilesDocBack(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

      // Check file type
      if (!allowedTypes.includes(file.type)) {
        this.docBackError = 'Only image files (JPEG, PNG, JPG) are allowed.';
        this.corporateForm.get('docBack')?.setValue(null); // Clear the invalid file
      } else {
        this.docBackError = null; // Clear any previous error
        // You can proceed to handle the file
        console.log('File is valid:', file);
      }
    }
    if (event.target.files && event.target.files[0]) {
      this.uploadedImageDocBack = event.target.files[0];
      this.uploadedImageFileNameDocBack = event.target.files[0].name;
    }
    // this.corporate.addAgentDocBack(this.uploadedImageDocBack, "custProofBackPhoto", this.submitterForId).subscribe((data: any) => {

    // })
  }
  detectFilesLicense(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

      // Check file type
      if (!allowedTypes.includes(file.type)) {
        this.licenseSignError = 'Only image files (JPEG, PNG, JPG) are allowed.';
        this.corporateForm.get('licenseSign')?.setValue(null); // Clear the invalid file
      } else {
        this.licenseSignError = null; // Clear any previous error
        // You can proceed to handle the file
        console.log('File is valid:', file);
      }
    }
    if (event.target.files && event.target.files[0]) {
      this.uploadedImageLicense = event.target.files[0];
      this.uploadedImageFileNameLicense = event.target.files[0].name;
    }
    // this.corporate.addAgentLicense(this.uploadedImageLicense, "bizOrGovtLicensePhoto", this.submitterForId).subscribe((data: any) => {

    // })
  }
  detectFilesAddressProof(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

      // Check file type
      if (!allowedTypes.includes(file.type)) {
        this.addressProofError = 'Only image files (JPEG, PNG, JPG) are allowed.';
        this.corporateForm.get('addressProof')?.setValue(null); // Clear the invalid file
      } else {
        this.addressProofError = null; // Clear any previous error
        // You can proceed to handle the file
        console.log('File is valid:', file);
      }
    }
    if (event.target.files && event.target.files[0]) {
      this.uploadedImageAddress = event.target.files[0];
      this.uploadedImageFileNameAddress = event.target.files[0].name;
    }
    // this.corporate.addAgentAddressProof(this.uploadedImageAddress, "addressProofPhoto", this.submitterForId).subscribe((data: any) => {

    // })
  }
  detectFilesTINLetter(event: any) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

      // Check file type
      if (!allowedTypes.includes(file.type)) {
        this.tinLetterError = 'Only image files (JPEG, PNG, JPG) are allowed.';
        this.corporateForm.get('tinLetter')?.setValue(null); // Clear the invalid file
      } else {
        this.tinLetterError = null; // Clear any previous error
        // You can proceed to handle the file
        console.log('File is valid:', file);
      }
    }
    if (event.target.files && event.target.files[0]) {
      this.uploadedImageTin = event.target.files[0];
      this.uploadedImageFileNametin = event.target.files[0].name;
    }
    // this.corporate.addAgentTin(this.uploadedImageTin, "tinLetterPhoto", this.submitterForId).subscribe((data: any) => {

    // })
  }

  onCancel() {
    this.cancel.emit();
  }
  getProvinceCurValue(): string {
    return this.showCurProText ? this.corporateForm.get('provinceTextCur')?.value : this.corporateForm.get('provinceAddress')?.value;
  }
  getDistrictCurValue(): string {
    return this.showCurDisText ? this.corporateForm.get('districtTextCur')?.value : this.corporateForm.get('districtAddress')?.value;
  }
  //
  getProvincePerValue(): string {
    return this.showPerProText ? this.corporateForm.get('provinceTextPer')?.value : this.corporateForm.get('permanentProvince')?.value;
  }
  getDistrictPerValue(): string {
    return this.showPerDisText ? this.corporateForm.get('districtTextPer')?.value : this.corporateForm.get('permanentDistrict')?.value;
  }
  callBasicAPI() {
    // let selectedGender = this.basicGender.value;
    // let custInfoMale = selectedGender === '1' ? '1' : "null";
    // let custInfoFemale = selectedGender === '2' ? '1' : "null";
    // let maritalValue = this.marital.value;
    // let custInfoSingle = maritalValue === '1' ? '1' : "null";
    // let custInfoMarried = maritalValue === '2' ? '1' : "null";
    if (this.agentType1.value == "AGENT") {
      let reqBasicAgent = {
        agentType: this.agentType1.value,
        email: this.submittedByEmail.value,
        username: this.submittedByUserName.value,
        firstName: this.submittedByFirst.value,
        lastName: this.submittedByLast.value,
        phone: this.submittedByPhone.value,
        userType: 'AGENT',
        gender: this.submittedByGender.value,
        password: this.submittedByPassword.value
      }
      this.corporate.agentRegister(reqBasicAgent).subscribe((data: any) => {
        this.submitterForId = data?.id
        if (!data) {
          alert("Id not present,Please try again")
        }
      })
    }
    else if (this.agentType1.value == "MERCHANT") {
      let reqBasicMerchant = {
        // agentType: this.agentType1.value,
        email: this.submittedByEmail.value,
        username: this.submittedByUserName.value,
        firstName: this.submittedByFirst.value,
        lastName: this.submittedByLast.value,
        phone: this.submittedByPhone.value,
        userType: 'MERCHANT',
        gender: this.submittedByGender.value,
        password: this.submittedByPassword.value
      }
      this.corporate.merchantRegister(reqBasicMerchant).subscribe((data: any) => {
        this.submitterForId = data?.id
        if (!data) {
          alert("Id not present,Please try again")
        }
      })
    }

  }
  onKeyPressNoAlphabet(event: KeyboardEvent): void {
    const charCode = event.which || event.keyCode;
    if ((charCode >= 65 && charCode <= 90) || (charCode >= 97 && charCode <= 122)) {
      // Prevent input if the pressed key is an alphabet character (ASCII range: 65-90, 97-122)
      event.preventDefault();
    }
  }
  //new
  public triggerFileInput(): void {
    document.getElementById('multipleDocs')?.click();
  }
  //check
  checkEmailExistenceReg() {
    const email = this.corporateForm.get('submittedByEmail')?.value;

    if (email) {
      this.corporate.checkEmailExist(email).subscribe(
        (response: any) => {
          if (response && response.data) {
            // Check if email matches any record with user type 'CUSTOMER'
            const customerMatch = response.data.find(
              (item: any) =>
                item.usertype === 'AGENT'
            );

            if (customerMatch) {
              this.emailErrorReg = true;
            } else {
              this.emailErrorReg = false; // Clear the error message if no match is found
            }
          }
        },
        (error) => {
          console.error('Error checking email existence:', error);
        }
      );
    }
  }
  checkEmailExistenceBasic() {
    const email = this.corporateForm.get('basicEmail')?.value;

    if (email) {
      this.corporate.checkEmailExist(email).subscribe(
        (response: any) => {
          if (response && response.data) {
            // Check if email matches any record with user type 'CUSTOMER'
            const customerMatch = response.data.find(
              (item: any) =>
                item.usertype === 'AGENT'
            );

            if (customerMatch) {
              this.emailErrorBasic = true;
            } else {
              this.emailErrorBasic = false; // Clear the error message if no match is found
            }
          }
        },
        (error) => {
          console.error('Error checking email existence:', error);
        }
      );
    }
  }
  checkPhoneExistenceReg() {
    const phone = this.corporateForm.get('submittedByPhone')?.value;

    if (phone) {
      this.corporate.checkPhoneExist(phone).subscribe(
        (response: any) => {
          if (response && response.data) {
            // Check if email matches any record with user type 'CUSTOMER'
            const customerMatch = response.data.find(
              (item: any) =>
                item.usertype === 'AGENT'
            );

            if (customerMatch) {
              this.phoneErrorReg = true;
            } else {
              this.phoneErrorReg = false; // Clear the error message if no match is found
            }
          }
        },
        (error) => {
          console.error('Error checking phone existence:', error);
        }
      );
    }
  }
  checkPhoneExistenceBasic() {
    const phone = this.corporateForm.get('basicPhone')?.value;

    if (phone) {
      this.corporate.checkPhoneExist(phone).subscribe(
        (response: any) => {
          if (response && response.data) {
            // Check if email matches any record with user type 'CUSTOMER'
            const customerMatch = response.data.find(
              (item: any) =>
                item.usertype === 'CUSTOMER'
            );

            if (customerMatch) {
              this.phoneErrorBasic = true
            } else {
              this.phoneErrorBasic = false; // Clear the error message if no match is found
            }
          }
        },
        (error) => {
          console.error('Error checking phone existence:', error);
        }
      );
    }
  }
  checkIdExists(): void {
    const idNumber = this.corporateForm.get('idNO')?.value;
    if (idNumber) {
      let req = {
        "idProof": this.corporateForm.get('idNO')?.value,
        "kycType": "CUSTOMER"
      }
      this.corporate.checkIDexists(req).subscribe(
        (data: any) => {
          // this.showIdExist = data.exists; // Assume API response contains "exists" field
          if (data?.data === true) {
            this.showIdExist = true; // Show error if username exists
          } else {
            this.showIdExist = false; // Hide error if username is valid
          }
        },
        (error) => {
          console.error('Error checking ID:', error);
          this.showIdExist = false; // Reset error on API failure
        }
      );
    }
  }
  checkPassnoExists(): void {
    const passNumber = this.corporateForm.get('passNO')?.value;
    if (passNumber) {
      let req = {
        "idProof": this.corporateForm.get('passNO')?.value,
        "kycType": "AGENT"
      }
      this.corporate.checkIDexists(req).subscribe(
        (data: any) => {
          // this.showIdExist = data.exists; // Assume API response contains "exists" field
          if (data?.data === true) {
            this.showPassExist = true; // Show error if username exists
          } else {
            this.showPassExist = false; // Hide error if username is valid
          }
        },
        (error) => {
          console.error('Error checking ID:', error);
          this.showPassExist = false; // Reset error on API failure
        }
      );
    }
  }
  // Detect and add multiple files to selectedFiles without uploading
  public detectFilesMultipleDocs(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files) {
      const files: FileList = input.files;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExists = this.selectedFiles.some(
          existingFile => existingFile.name === file.name && existingFile.size === file.size
        );

        if (!fileExists) {
          this.selectedFiles.push(file); // ✅ Only unique files
        }
      }
    }
    // ✅ Reset the input to allow re-selecting the same files if needed
    input.value = '';
  }
  // Function to upload all files in selectedFiles
  public MultipleDocUpload(): void {
    if (this.selectedFiles.length > 0) {
      const uploadObservables = this.selectedFiles.map(file =>
        this.corporate.addAgentMultipleDoc(file, "otherDocs", this.submitterForId)
      );
      // Execute uploads in parallel
      forkJoin<any[]>(uploadObservables).subscribe(
        (responses: any[]) => {
          console.log('All files uploaded successfully:', responses);
          // Handle success response as needed
        },
        (error) => {
          console.error('Error uploading files:', error);
          // Handle error as needed
        }
      );
    } else {
      console.log('No files to upload');
    }
  }
  // Remove a specific file from selectedFiles by its index
  public removeFile(index: number): void {
    this.selectedFiles.splice(index, 1); // Remove file from selectedFiles array
  }
  callDocUploadAPI() {
    const uploadIfPresent = (file: any, fn: () => Observable<any>) => {
      return file ? fn() : of({ responseCode: 200 });
    };

    uploadIfPresent(this.uploadedImageUser, () =>
      this.corporate.addAgentPhoto(this.uploadedImageUser, "agentPhoto", this.submitterForId)
    ).pipe(
      switchMap((data: any) => {
        if (data?.responseCode !== 200) throw new Error('Failed to upload Agent Photo');
        return uploadIfPresent(this.uploadedImageDigSign, () =>
          this.corporate.addAgentDigSign(this.uploadedImageDigSign, "agentSignaturePhoto", this.submitterForId)
        );
      }),
      switchMap((data: any) => {
        if (data?.responseCode !== 200) throw new Error('Failed to upload Digital Signature');
        return uploadIfPresent(this.uploadedImageDocFront, () =>
          this.corporate.addAgentDocFront(this.uploadedImageDocFront, "custProofFrontPhoto", this.submitterForId)
        );
      }),
      switchMap((data: any) => {
        if (data?.responseCode !== 200) throw new Error('Failed to upload Document Front');
        return uploadIfPresent(this.uploadedImageDocBack, () =>
          this.corporate.addAgentDocBack(this.uploadedImageDocBack, "custProofBackPhoto", this.submitterForId)
        );
      }),
      switchMap((data: any) => {
        if (data?.responseCode !== 200) throw new Error('Failed to upload Document Back');
        return uploadIfPresent(this.uploadedImageLicense, () =>
          this.corporate.addAgentLicense(this.uploadedImageLicense, "bizOrGovtLicensePhoto", this.submitterForId)
        );
      }),
      switchMap((data: any) => {
        if (data?.responseCode !== 200) throw new Error('Failed to upload Business License');
        return uploadIfPresent(this.uploadedImageAddress, () =>
          this.corporate.addAgentAddressProof(this.uploadedImageAddress, "addressProofPhoto", this.submitterForId)
        );
      }),
      switchMap((data: any) => {
        if (data?.responseCode !== 200) throw new Error('Failed to upload Address Proof');
        return uploadIfPresent(this.uploadedImageTin, () =>
          this.corporate.addAgentTin(this.uploadedImageTin, "tinLetterPhoto", this.submitterForId)
        );
      }),
      switchMap((data: any) => {
        if (data?.responseCode !== 200) throw new Error('Failed to upload TIN');

        // ✅ Only call MultipleDocUpload if other documents exist
        if (this.selectedFiles && this.selectedFiles.length > 0) {
          this.MultipleDocUpload(); // directly call since it handles its own forkJoin
        }
        return of({ responseCode: 200 });
      }),
      catchError(error => {
        console.error(error.message);
        return of(null);
      })
    ).subscribe((data: any) => {
      if (data?.responseCode === 200) {
        console.log('All documents uploaded successfully');
      } else {
        console.error('Final document upload failed');
      }
    });
  }
  //edit API
  onSubmitEdit() {
    if (this.corporateForm.get('idType')?.value == "PASSPORT") {
      this.idValue = this.passNO.value
      console.log("idValue", this.idValue)
    }
    else if (this.corporateForm.get('idType')?.value == "E_TAZKIRA" ||
      this.corporateForm.get('idType')?.value == "PAPER_TAZKIRA") {
      this.idValue = this.idNO.value
      console.log("idValue1", this.idValue)
    }
    let req = {
      kycInputs: {
        custInfoFirstName: this.corporateForm.get('basicFirstName')?.value,
        custInfoLastName: this.corporateForm.get('basicLastName')?.value,
        custInfoFatherName: this.corporateForm.get('basicFatherName')?.value,
        custProofType: this.corporateForm.get('idType')?.value,
        custProofNumber: this.idValue,
        custProofDateOfExpiry: this.corporateForm.get('expiryDate')?.value,
        custProofDateOfIssue: this.corporateForm.get('issue')?.value,
        tazkiraPageNo: this.corporateForm.get('pageNO')?.value,
        tazkiraBookNo: this.corporateForm.get('bookNO')?.value,
        tazkiraRegNo: this.corporateForm.get('regNO')?.value,

        custInfoDob: this.corporateForm.get('dob')?.value,
        custInfoBirthCountry: this.corporateForm.get('country')?.value,
        custInfoBirthProvince: this.corporateForm.get('province')?.value,
        custInfoGender: this.corporateForm.get('genderInfo')?.value,
        custInfoMaritalStatus: this.corporateForm.get('marital')?.value,

        custInfoNationality: this.corporateForm.get('nationality')?.value,
        custInfoPhoneNumber: this.corporateForm.get('basicPhone')?.value,
        custInfoEmail: this.corporateForm.get('basicEmail')?.value,
        custInfoPurposeOfAcc: this.corporateForm.get('accPurpose')?.value,
        custInfoPTID: this.corporateForm.get('PTID')?.value,

        currLocation: this.corporateForm.get('locationAddress')?.value,
        currCountry: this.corporateForm.get('countryAddress')?.value,
        // currProvince: this.corporateForm.get('provinceAddress')?.value,
        // currDistrict: this.corporateForm.get('districtAddress')?.value,
        currProvince: this.getProvinceCurValue(),
        currDistrict: this.getDistrictCurValue(),
        currStreet: this.corporateForm.get('streetAddress')?.value,

        permCountry: this.corporateForm.get('permanentCountry')?.value,
        // permProvince: this.corporateForm.get('permanentProvince')?.value,
        // permDistrict: this.corporateForm.get('permanentDistrict')?.value,
        permProvince: this.getProvincePerValue(),
        permDistrict: this.getDistrictPerValue(),

        orgSourceOfIncome: this.corporateForm.get('incomeSourceOrg')?.value,
        orgName: this.corporateForm.get('ShopName')?.value,
        orgPositionHeld: this.corporateForm.get('positionorg')?.value,
        orgAddress: this.corporateForm.get('address')?.value,
        orgMonthlyIncome: this.corporateForm.get('monthlyIncomeorg')?.value,
        orgTurnover: this.corporateForm.get('TurnoverOrg')?.value,
        orgBizNature: this.corporateForm.get('natureOfBusiness')?.value,
        orgTinNumber: this.corporateForm.get('tinOrg')?.value,

        otherMnoFacility: this.corporateForm.get('haveOtherAccounts')?.value,
        otherMnoName: this.corporateForm.get('EMIname')?.value,
        otherMnoAccName: this.corporateForm.get('accountName')?.value,
        otherMnoAccNo: this.corporateForm.get('accountNo')?.value,

        nokName: this.corporateForm.get('nameKin')?.value,
        nokFatherName: this.corporateForm.get('fatherKin')?.value,
        nokRelationship: this.corporateForm.get('relationship')?.value,
        nokPhone: this.corporateForm.get('numberKin')?.value,
        nokLocation: this.corporateForm.get('kinAddress')?.value,

      },
      kycType: "AGENT",
      submittedFor: this.item?.submittedFor?.id
    }
    this.callDocUploadAPI();
    // this.isLoading = true;
    this.KycService.agentFinalUpdate(req).subscribe((data: any) => {
      // this.isLoading = false;
      if (data?.responseCode == 200) {
        this.corporate.agentComplete(this.submitterForId).subscribe((data: any) => {
          if (data?.responseCode == 200) {
            // alert("Registartion completed successfully");
            alert("Updated Successfully")
          }
        })
      }
      else {
        alert("failed")
      }
    })
  }
  //new
  callAgentRegisterAPI() {
    const accPurpose = this.accPurposeTextBox ? this.corporateForm.get('accPurposeText')?.value : this.accPurpose.value;
    if (this.agentType1.value == "AGENT") {
      let reqAgentRegister = {
        kycInputs: {
          accountType: this.accType.value,
          custInfoFirstName: this.basicFirstName.value,
          custInfoLastName: this.basicLastName.value,
          custInfoFatherName: this.basicFatherName.value,
          // custInfoMMWallet: this.basicwallet.value,
          custProofType: this.idType.value,
          custProofNumber: this.idNO.value,
          custProofDateOfIssue: this.issueDate.value,
          custProofDateOfExpiry: this.expiryDate.value,
          tazkiraPageNo: this.pageNO.value,
          tazkiraRegNo: this.regNO.value,
          tazkiraBookNo: this.bookNO.value,
          custInfoDob: this.dob.value,
          custInfoBirthCountry: this.country.value,
          custInfoBirthProvince: this.province.value,
          custInfoGender: this.genderInfo.value,
          custInfoMaritalStatus: this.marital.value,
          custInfoNationality: this.nationality.value,
          custInfoPhoneNumber: this.basicPhone.value,
          custInfoEmail: this.basicEmail.value,
          custInfoAccOpenDate: this.currentDate,
          custInfoPTID: this.PTID.value,
          custInfoPurposeOfAcc: accPurpose,

        },
        kycType: "AGENT",
        submittedFor: this.submitterForId,
      }
      this.corporate.agentSubmit(reqAgentRegister).subscribe((data: any) => {
        if (data?.responseCode != 200) {
          alert("Error submiiting,please try again")
        }
      })
    }
    else if (this.agentType1.value == "MERCHANT") {
      let reqAgentRegister = {
        kycInputs: {
          accountType: "MERCHANT",
          custInfoFirstName: this.basicFirstName.value,
          custInfoLastName: this.basicLastName.value,
          custInfoFatherName: this.basicFatherName.value,
          // custInfoMMWallet: this.basicwallet.value,
          custProofType: this.idType.value,
          custProofNumber: this.idNO.value,
          custProofDateOfIssue: this.issueDate.value,
          custProofDateOfExpiry: this.expiryDate.value,
          tazkiraPageNo: this.pageNO.value,
          tazkiraRegNo: this.regNO.value,
          tazkiraBookNo: this.bookNO.value,
          custInfoDob: this.dob.value,
          custInfoBirthCountry: this.country.value,
          custInfoBirthProvince: this.province.value,
          custInfoGender: this.genderInfo.value,
          custInfoMaritalStatus: this.marital.value,
          custInfoNationality: this.nationality.value,
          custInfoPhoneNumber: this.basicPhone.value,
          custInfoEmail: this.basicEmail.value,
          custInfoAccOpenDate: this.currentDate,
          custInfoPTID: this.PTID.value,
          custInfoPurposeOfAcc: accPurpose,

        },
        kycType: "MERCHANT",
        submittedFor: this.submitterForId,
      }
      this.corporate.agentSubmit(reqAgentRegister).subscribe((data: any) => {
        if (data?.responseCode != 200) {
          alert("Error submiiting,please try again")
        }
      })
    }
  }

  callCurrentAPI() {
    if (this.agentType1.value == "AGENT") {
      let reqCurrent = {
        kycInputs: {
          // currLocation: this.locationAddress.value,
          // currProvince: this.getProvinceCurValue(),
          // currStreet: this.streetAddress.value,
          // currDistrict: this.getDistrictCurValue(),
          // currCountry: this.countryAddress.value,

          currLocation: this.locationAddress.value,
          currStreet: this.streetAddress.value,
          currCountry: this.countryAddress.value,
          currProvince: this.getProvinceCurValue(),
          // currProvinceId: "not",
          currDistrict: this.getDistrictCurValue(),
          // currDistrictId: "not",
          //new
          processedByOpsFullName: this.loginFullname,
          processedByOpsUsername: this.loginUsername,
          processedByOpsDate: this.loginDate
        },
        kycType: "AGENT",
        submittedFor: this.submitterForId,

      }
      this.corporate.agentUpdate(reqCurrent).subscribe((data: any) => {
        if (data?.responseCode != 200) {
          alert("Error submiiting,please try again")
        }
      })
    }
    else if (this.agentType1.value == "MERCHANT") {
      let reqCurrent = {
        kycInputs: {
          // currLocation: this.locationAddress.value,
          // currProvince: this.getProvinceCurValue(),
          // currStreet: this.streetAddress.value,
          // currDistrict: this.getDistrictCurValue(),
          // currCountry: this.countryAddress.value,

          currLocation: this.locationAddress.value,
          currStreet: this.streetAddress.value,
          currCountry: this.countryAddress.value,
          currProvince: this.getProvinceCurValue(),
          // currProvinceId: "not",
          currDistrict: this.getDistrictCurValue(),
          // currDistrictId: "not",
        },
        kycType: "MERCHANT",
        submittedFor: this.submitterForId,
      }
      this.corporate.agentUpdate(reqCurrent).subscribe((data: any) => {
        if (data?.responseCode != 200) {
          alert("Error submiiting,please try again")
        }
      })
    }
  }
  callPermAPI() {
    if (this.agentType1.value == "AGENT") {
      let reqPerm = {
        kycInputs: {
          permCountry: this.permanentCountry.value,
          permProvince: this.getProvincePerValue(),
          permDistrict: this.getDistrictPerValue(),
          // permProvinceId: "not",
          // permDistrictId: "not",
        },
        kycType: "AGENT",
        submittedFor: this.submitterForId,
      }
      this.corporate.agentUpdate(reqPerm).subscribe((data: any) => {
        if (data?.responseCode != 200) {
          alert("Error submiiting,please try again")
        }
      })
    }
    else if (this.agentType1.value == "MERCHANT") {
      let reqPerm = {
        kycInputs: {
          permCountry: this.permanentCountry.value,
          permProvince: this.getProvincePerValue(),
          permDistrict: this.getDistrictPerValue(),
          // permProvinceId: "not",
          // permDistrictId: "not",
        },
        kycType: "MERCHANT",
        submittedFor: this.submitterForId,
      }
      this.corporate.agentUpdate(reqPerm).subscribe((data: any) => {
        if (data?.responseCode != 200) {
          alert("Error submiiting,please try again")
        }
      })
    }
  }
  // callAgentTypeAPI() {
  //   let MMvalue = this.MMacc.value;
  //   let mmAgent = MMvalue === '1' ? '1' : null;
  //   let mmUSSD = MMvalue === '2' ? '1' : null;
  //   let mmStaff = MMvalue === '3' ? '1' : null;
  //   let mmMicro = MMvalue === '4' ? '1' : null;
  //   let mmMerchant = MMvalue === '5' ? '1' : null; let reqAgentType = {
  //     kycInputs: {
  //       mmAgent: mmAgent,
  //       mmUSSD: mmUSSD,
  //       mmStaff: mmStaff,
  //       mmMicro: mmMicro,
  //       mmMerchant: mmMerchant,
  //     },
  //     kycType: "AGENT",
  //     submittedFor: this.submitterForId,
  //   }
  //   this.corporate.agentUpdate(reqAgentType).subscribe((data: any) => {
  //   })
  // }
  private stripCurrencyFormatting(value: string): string {
    return value ? value.replace(/[^0-9]/g, '') : '';
  }
  callOrgAPI() {
    const bizNature = this.natureTextBox ? this.corporateForm.get('natureText')?.value : this.natureOfBusiness.value;
    const incmSource = this.sourceTextBox ? this.corporateForm.get('sourceText')?.value : this.incomeSourceOrg.value;
    if (this.agentType1.value == "AGENT") {
      let reqOrg = {
        kycInputs: {
          orgSourceOfIncome: incmSource,
          orgName: this.ShopName.value,
          orgPositionHeld: this.positionorg.value,
          orgAddress: this.address.value,
          orgMonthlyIncome: this.stripCurrencyFormatting(this.corporateForm.get('monthlyIncomeorg')?.value),
          orgTurnover: this.stripCurrencyFormatting(this.corporateForm.get('TurnoverOrg')?.value),
          orgBizNature: bizNature,
          orgTinNumber: this.tinOrg.value,
        },
        kycType: "AGENT",
        submittedFor: this.submitterForId,
      }
      this.corporate.agentUpdate(reqOrg).subscribe((data: any) => {
        if (data?.responseCode != 200) {
          alert("Error submiiting,please try again")
        }
      })
    }
    else if (this.agentType1.value == "MERCHANT") {
      let reqOrg = {
        kycInputs: {
          orgSourceOfIncome: incmSource,
          orgName: this.ShopName.value,
          orgPositionHeld: this.positionorg.value,
          orgAddress: this.address.value,
          orgMonthlyIncome: this.stripCurrencyFormatting(this.corporateForm.get('monthlyIncomeorg')?.value),
          orgTurnover: this.stripCurrencyFormatting(this.corporateForm.get('TurnoverOrg')?.value),
          orgBizNature: bizNature,
          orgTinNumber: this.tinOrg.value,
        },
        kycType: "MERCHANT",
        submittedFor: this.submitterForId,
      }
      this.corporate.agentUpdate(reqOrg).subscribe((data: any) => {
        if (data?.responseCode != 200) {
          alert("Error submiiting,please try again")
        }
      })
    }
  }
  callEmiAPI() {
    let emiValue = this.haveOtherAccounts.value;
    let otherMnoYes = emiValue === '1' ? '1' : null;
    let otherMnoNo = emiValue === '2' ? '1' : null;
    if (this.agentType1.value == "AGENT") {
      let reqMno = {
        kycInputs: {
          otherMnoFacility: this.haveOtherAccounts.value,
          otherMnoName: this.EMIname.value,
          otherMnoAccName: this.accountName.value,
          otherMnoAccNo: this.accountNo.value,
        },
        kycType: "AGENT",
        submittedFor: this.submitterForId,
      }
      this.corporate.agentUpdate(reqMno).subscribe((data: any) => {
        if (data?.responseCode != 200) {
          alert("Error submiiting,please try again")
        }
      })
    }
    else if (this.agentType1.value == "MERCHANT") {
      let reqMno = {
        kycInputs: {
          otherMnoFacility: this.haveOtherAccounts.value,
          otherMnoName: this.EMIname.value,
          otherMnoAccName: this.accountName.value,
          otherMnoAccNo: this.accountNo.value,
        },
        kycType: "MERCHANT",
        submittedFor: this.submitterForId,
      }
      this.corporate.agentUpdate(reqMno).subscribe((data: any) => {
        if (data?.responseCode != 200) {
          alert("Error submiiting,please try again")
        }
      })
    }
  }

  // callFinalAPI() {
  // callDocUploadAPI() {
  //   this.corporate.addAgentPhoto(this.uploadedImageUser, "agentPhoto", this.submitterForId).subscribe((data: any) => {
  //     if (data?.responseCode == 200) {
  //       this.corporate.addAgentDigSign(this.uploadedImageDigSign, "agentSignaturePhoto", this.submitterForId).subscribe((data: any) => {
  //         if (data?.responseCode == 200) {
  //           this.corporate.addAgentDocFront(this.uploadedImageDocFront, "custProofFrontPhoto", this.submitterForId).subscribe((data: any) => {
  //             if (data?.responseCode == 200) {
  //               this.corporate.addAgentDocBack(this.uploadedImageDocBack, "custProofBackPhoto", this.submitterForId).subscribe((data: any) => {
  //                 if (data?.responseCode == 200) {
  //                   this.corporate.addAgentLicense(this.uploadedImageLicense, "bizOrGovtLicensePhoto", this.submitterForId).subscribe((data: any) => {
  //                     if (data?.responseCode == 200) {
  //                       this.corporate.addAgentAddressProof(this.uploadedImageAddress, "addressProofPhoto", this.submitterForId).subscribe((data: any) => {
  //                         if (data?.responseCode == 200) {
  //                           this.corporate.addAgentTin(this.uploadedImageTin, "tinLetterPhoto", this.submitterForId).subscribe((data: any) => {
  //                             if (data?.responseCode == 200) {

  //                             }
  //                           })
  //                         }
  //                       })
  //                     }
  //                   })
  //                 }
  //               })
  //             }
  //           })
  //         }
  //       })
  //     }
  //   })
  // }
  // callDocUploadAPI() {
  //   this.corporate.addAgentPhoto(this.uploadedImageUser, "agentPhoto", this.submitterForId).pipe(
  //     switchMap((data: any) => {
  //       if (data?.responseCode !== 200) {
  //         throw new Error('Failed to upload Agent Photo');
  //       }
  //       return this.corporate.addAgentDigSign(this.uploadedImageDigSign, "agentSignaturePhoto", this.submitterForId);
  //     }),
  //     switchMap((data: any) => {
  //       if (data?.responseCode !== 200) {
  //         throw new Error('Failed to upload Digital Signature');
  //       }
  //       return this.corporate.addAgentDocFront(this.uploadedImageDocFront, "custProofFrontPhoto", this.submitterForId);
  //     }),
  //     switchMap((data: any) => {
  //       if (data?.responseCode !== 200) {
  //         throw new Error('Failed to upload Document Front');
  //       }
  //       return this.corporate.addAgentDocBack(this.uploadedImageDocBack, "custProofBackPhoto", this.submitterForId);
  //     }),
  //     switchMap((data: any) => {
  //       if (data?.responseCode !== 200) {
  //         throw new Error('Failed to upload Document Back');
  //       }
  //       return this.corporate.addAgentLicense(this.uploadedImageLicense, "bizOrGovtLicensePhoto", this.submitterForId);
  //     }),
  //     switchMap((data: any) => {
  //       if (data?.responseCode !== 200) {
  //         throw new Error('Failed to upload Business License');
  //       }
  //       return this.corporate.addAgentAddressProof(this.uploadedImageAddress, "addressProofPhoto", this.submitterForId);
  //     }),
  //     switchMap((data: any) => {
  //       if (data?.responseCode !== 200) {
  //         throw new Error('Failed to upload Address Proof');
  //       }
  //       return this.corporate.addAgentTin(this.uploadedImageTin, "tinLetterPhoto", this.submitterForId);
  //     }),
  //     switchMap((data: any) => {
  //       if (data?.responseCode !== 200) {
  //         throw new Error('Failed to upload TIN');
  //       }
  //       // Call MultipleDocUpload after the TIN upload completes successfully
  //       return of(this.MultipleDocUpload()); // Wrap in `of()` to treat it as an observable
  //     }),
  //     catchError(error => {
  //       console.error(error.message);
  //       return of(null); // Return a safe observable in case of an error
  //     })
  //   ).subscribe((data: any) => {
  //     if (data?.responseCode === 200) {
  //       console.log('All documents uploaded successfully');
  //     } else {
  //       console.error('Final document upload failed');
  //     }
  //   });
  // }

  submit() {
    const relation = this.relationTextBox ? this.corporateForm.get('relationText')?.value : this.relationship.value;

    if (this.agentType1.value == "AGENT") {
      let reqKin = {
        kycInputs: {
          nokName: this.nameKin.value,
          nokFatherName: this.fatherKin.value,
          nokRelationship: relation,
          nokPhone: this.numberKin.value,
          nokLocation: this.kinAddress.value
        },
        kycType: "AGENT",
        submittedFor: this.submitterForId,
      }
      this.corporate.agentUpdate(reqKin).subscribe((data: any) => {
        if (data?.responseCode != 200) {
          alert("Error submiiting,please try again")
        }
        this.corporate.agentComplete(this.submitterForId).subscribe((data: any) => {
          if (data?.responseCode == 200) {
            alert("Registartion completed successfully");
            this.router.navigate(["corporate/list-direct-agent"]);
          }
          else {
            alert("Error completing the registration,please try again")
          }
        })
      })
    }
    else if (this.agentType1.value == "MERCHANT") {
      let reqKin = {
        kycInputs: {
          nokName: this.nameKin.value,
          nokFatherName: this.fatherKin.value,
          nokRelationship: relation,
          nokPhone: this.numberKin.value,
          nokLocation: this.kinAddress.value
        },
        kycType: "MERCHANT",
        submittedFor: this.submitterForId,
      }
      this.corporate.agentUpdate(reqKin).subscribe((data: any) => {
        if (data?.responseCode != 200) {
          alert("Error submiiting,please try again")
        }
        this.corporate.agentComplete(this.submitterForId).subscribe((data: any) => {
          if (data?.responseCode == 200) {
            alert("Registartion completed successfully")
          }
          else {
            alert("Error completing the registration,please try again")
          }
        })
      })
    }
  }
  // submit() {
  // }
}

