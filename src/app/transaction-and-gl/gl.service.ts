import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpParams } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class GlService {
  private getHeaders(): HttpHeaders {
    let token = sessionStorage.getItem("token");
    if (token == null || token == undefined) {
      token = "Dummy Value";
    }
    return new HttpHeaders().set("Authorization", "Bearer " + token);
  }
  constructor(private httpClient: HttpClient) { }
  public getAllHeadAccounts(value: any) {
    let url = `${environment.apiUrl}/ams/api/head-accounts?type=${value}`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.get<any>(url, { headers: h });
  }
  public getAllChartAccounts(categoryValue: any) {
    let url = `${environment.apiUrl}/ams/api/leaf-accounts/getByType?type=` + categoryValue;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.get<any>(url, { headers: h });
  }
  public getAllAccNo(type: any) {
    // let url = `${environment.apiUrl}/ams/api/leaf-accounts/getAllAccNo?type=` + type;
    let url = `${environment.apiUrl}/ams/api/leaf-accounts/getAllLeafAccountsOfCoaGlByType?type=` + type;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.get<any>(url, { headers: h });
  }
  public getAllAccNoWithoutType() {
    let url = `${environment.apiUrl}/ams/api/leaf-accounts/getAllLeafAccountsOfCoaGl`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.get<any>(url, { headers: h });
  }
  public getAllAccNoCoaSubTable(sub: any) {
    // let url = `${environment.apiUrl}/ams/api/leaf-accounts/getAllAccNo?type=` + type;
    let url = `${environment.apiUrl}/ams/api/leaf-accounts/getAllLeafAccountsOfWalletCoaGlBySub?sub=` + sub;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.get<any>(url, { headers: h });
  }
  public getAllAccNoWithoutTypeCoaSubTable() {
    let url = `${environment.apiUrl}/ams/api/leaf-accounts/getAllLeafAccountsOfWalletCoaGl`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.get<any>(url, { headers: h });
  }
  public getStatusCheckResultDetails(batchIds: string[]) {
    const batchIdParam = batchIds
      .map(id => `batchIds=${encodeURIComponent(id)}`)
      .join('&');
    const url = `${environment.apiUrl}/ts/api/transaction-services/getTransaction?${batchIdParam}`;
    console.log("Final URL before interceptor:", url);
    return this.httpClient.get(url, {
      headers: this.getHeaders()
    });
  }
  public getStatusCheckResult(batchIds: string[]) {
    const batchIdParam = batchIds
      .map(id => `batchIds=${encodeURIComponent(id)}`)
      .join('&');
    const url = `${environment.apiUrl}/ts/api/transaction-services/getTransactionProcess?${batchIdParam}`;
    console.log("Final URL before interceptor:", url);
    return this.httpClient.get(url, {
      headers: this.getHeaders()
    });
  }
  public getSetaraganTransactionProcess(batchIds: string[]) {
    const batchIdParam = batchIds
      .map(id => `batchIds=${encodeURIComponent(id)}`)
      .join('&');
    const url = `${environment.apiUrl}/ts/api/transaction-services/getTransactionSetaraganProcess?${batchIdParam}`;
    console.log("Final URL before interceptor:", url);
    return this.httpClient.get(url, {
      headers: this.getHeaders()
    });
  }
  public getTransactionList(batchIds: string[]) {
    const batchIdParam = batchIds
      .map(id => `batchIds=${encodeURIComponent(id)}`)
      .join('&');
    const url = `${environment.apiUrl}/ts/api/transaction-services/getTransaction?${batchIdParam}`;
    console.log("Final URL before interceptor:", url);
    console.log("batchIdParam:", batchIdParam);
    return this.httpClient.get(url, {
      headers: this.getHeaders()
    });
  }
  public searchByAccNo(accNoValue: any, type: any, page: any) {
    let url = `${environment.apiUrl}/ams/api/leaf-accounts/getByAccNo?name=` + accNoValue + "&type=" + type + "&page=" + page;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.get<any>(url, { headers: h });
  }
  public getAllHeadAccNo(type: any) {
    let url = `${environment.apiUrl}/ams/api/head-accounts/getAllHeadAccNo?type=` + type;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.get<any>(url, { headers: h });
  }
  public getAllHeadAccNoWithoutType() {
    let url = `${environment.apiUrl}/ams/api/head-accounts/getAllHeadAccNoWithoutType`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.get<any>(url, { headers: h });
  }
  public searchByHeadAccNo(headAccNoValue: any, type: any, page: any) {
    let url = `${environment.apiUrl}/ams/api/leaf-accounts/getByHeadAccNo?name=` + headAccNoValue + "&type=" + type + "&page=" + page;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.get<any>(url, { headers: h });
  }
  public getAllSubAccNo(type: any) {
    let url = `${environment.apiUrl}/ams/api/sub-accounts/getAllSubAccNo?type=` + type;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.get<any>(url, { headers: h });
  }
  public getAllSubAccNoWithoutType() {
    let url = `${environment.apiUrl}/ams/api/sub-accounts/getAllSubAccNoWithoutType`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.get<any>(url, { headers: h });
  }
  public searchBySubAccNo(SubAccNoValue: any, type: any, page: any) {
    // let url = `${environment.apiUrl}/ams/api/leaf-accounts/getBySubAccNo?name=` + SubAccNoValue + "&type=" + type + "&page=" + page;
    let url = `${environment.apiUrl}/ams/api/leaf-accounts/getBySubAccNoWithoutFilterWithName?name=` + SubAccNoValue + "&page=" + page;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.get<any>(url, { headers: h });
  }
  public filterByDateTransData(walletNo: any, fromDate: any, toDate: any) {
    let url = `${environment.apiUrl}/ams/api/leaf-accounts/getUserTransactionHistoryByDate?walletNo=` + walletNo + "&fromDate=" + fromDate + "&toDate=" + toDate;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.get<any>(url, { headers: h });
  }
  public searchByNameCoa(searchText: any, type: any, page: any) {
    let url = `${environment.apiUrl}/ams/api/leaf-accounts/getByAccName?name=` + searchText + "&type=" + type + "&page=" + page;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.get<any>(url, { headers: h });
  }
  public searchByNameCoaWithoutType(searchText: any, page: any, size: any) {
    let url = `${environment.apiUrl}/ams/api/head-accounts/getCoaByAccountName?page=` + page + "&size=" + size + "&accName=" + searchText
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.get<any>(url, { headers: h });
  }
  public searchByNameCoaSub(subacc: any, searchText: any, page: any, size: any) {
    let url = `${environment.apiUrl}/ams/api/leaf-accounts/getLeafBySubAccByAccName?sub=` + subacc + "&accName=" + searchText + "&page=" + page + "&size=" + size
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.get<any>(url, { headers: h });
  }
  public searchByCategoryText(searchText: any, page: any) {
    let url = `${environment.apiUrl}/ams/api/leaf-accounts/getByAccName?name=` + searchText + "&page=" + page
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.get<any>(url, { headers: h });
  }
  public getAllChartAccountsAsset(categoryValue: any, page: any) {
    let url = `${environment.apiUrl}/ams/api/leaf-accounts/getByType?type=` + "ASSET" + "&page=" + page;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.get<any>(url, { headers: h });
  }
  public getAllChartAccountsIncome(categoryValue: any, page: any) {
    let url = `${environment.apiUrl}/ams/api/leaf-accounts/getByType?type=` + "INCOME" + "&page=" + page;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.get<any>(url, { headers: h });
  }
  public getAllChartAccountsExpense(categoryValue: any, page: any) {
    let url = `${environment.apiUrl}/ams/api/leaf-accounts/getByType?type=` + "EXPENSE" + "&page=" + page;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.get<any>(url, { headers: h });
  }
  public getAllChartAccountsLiability(categoryValue: any, page: any) {
    let url = `${environment.apiUrl}/ams/api/leaf-accounts/getByType?type=` + "LIABILITY" + "&page=" + page;
    // let url = `${environment.apiUrl}/ams/api/sub-accounts/getByTypeByHead?type=` + "LIABILITY" + "&head=" + head + "&page=" + page;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.get<any>(url, { headers: h });
  }
  public CoaBasicFilterByAccType(value: any) {
    let url = `${environment.apiUrl}/ams/api/head-accounts/getCoaByType?page=` + 0 + "&size=" + 100 + "&accType=" + value;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.get<any>(url, { headers: h });
  }
  public CoaBasicFilterByAccTypeSub(value: any) {
    let url = `${environment.apiUrl}/ams/api/leaf-accounts/getLeafBySubAccByType?type=` + value + "&page=" + 0 + "&size=" + 100;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.get<any>(url, { headers: h });
  }
  public CoaBasicFilterByAccNo(value: any) {
    let url = `${environment.apiUrl}/ams/api/head-accounts/getCoaByAccount?page=` + 0 + "&size=" + 100 + "&acc=" + value;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.get<any>(url, { headers: h });
  }
  public CoaBasicFilterByAccNoSub(subAcc: any, value: any) {
    let url = `${environment.apiUrl}/ams/api/leaf-accounts/getLeafBySubAccByAcc?sub=` + subAcc + "&acc=" + value + "&page=" + 0 + "&size=" + 100;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.get<any>(url, { headers: h });
  }
  public CoaBasicFilterByHeadAccNo(value: any) {
    let url = `${environment.apiUrl}/ams/api/head-accounts/getCoaByHeadAccount?page=` + 0 + "&size=" + 100 + "&head=" + value;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.get<any>(url, { headers: h });
  }
  public CoaBasicFilterByHeadAccNoSub(value: any) {
    let url = `${environment.apiUrl}/ams/api/leaf-accounts/getLeafBySubAccByHeadAcc?head=` + value + "&page=" + 0 + "&size=" + 100;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.get<any>(url, { headers: h });
  }
  public CoaBasicFilterBySubAccNo(value: any) {
    let url = `${environment.apiUrl}/ams/api/head-accounts/getCoaBySubAccount?page=` + 0 + "&size=" + 100 + "&subAcc=" + value;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.get<any>(url, { headers: h });
  }
  public CoaBasicFilterBySubAccNoSub(subAccountNo: any, value: any) {
    let url = `${environment.apiUrl}/ams/api/leaf-accounts/getLeafBySubAccBySubAc?sub=` + subAccountNo + "&subAcc=" + value + "&page=" + 0 + "&size=" + 200;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.get<any>(url, { headers: h });
  }
  // public getAllChartOfAccBasic(type: string) {
  //  let url = `${environment.apiUrl}/ams/api/head-accounts/getCoa`;
  //   let h: HttpHeaders = this.getHeaders().set(
  //     "Content-Type",
  //     "application/json"
  //   );
  //   console.log(url);
  //   return this.httpClient.get<any>(url, { headers: h });
  // }
  public getPLdata(page: any, size: any, date: any) {
    let url = `${environment.apiUrl}/ams/api/head-accounts/getProfitLoss?page=` + page + "&size=" + size + "&date=" + date;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.get<any>(url, { headers: h });
  }
  public getBalanceSheetData(page: any, size: any, date: any) {
    let url = `${environment.apiUrl}/ams/api/head-accounts/getBalanceSheet?page=` + page + "&size=" + size + "&date=" + date;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.get<any>(url, { headers: h });
  }
  public getBalanceSheetBySubAc(sub: any, date: any, page: any, size: any) {
    let url = `${environment.apiUrl}/ams/api/leaf-accounts/getBalanceSheetBySubAc?sub=` + sub + "&date=" + date + "&page=" + page + "&size=" + size;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.get<any>(url, { headers: h });
  }
  public getBalanceSheetBySubAcWithoutPagination(sub: any, date: any) {
    let url = `${environment.apiUrl}/ams/api/leaf-accounts/getBalanceSheetBySubAcWithoutPagination?sub=` + sub + "&date=" + date;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.get<any>(url, { headers: h });
  }
  public getBalanceSheetAccStatementWithoutPaginationDate(acc: any, fromDate: any, toDate: any) {
    let url = `${environment.apiUrl}/ams/api/leaf-accounts/getBalanceSheetAccStatementWithoutPagination?acc=` + acc + "&fromDate=" + fromDate + "&toDate=" + toDate;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.get<any>(url, { headers: h });
  }
  public getBalanceSheetAccStatement(acc: any, from: any, to: any) {
    let url = `${environment.apiUrl}/ams/api/leaf-accounts/getBalanceSheetAccStatement?acc=` + acc + "&fromDate=" + from + "&toDate=" + to;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.get<any>(url, { headers: h });
  }
  public getAllChartOfAccBasic(page: any) {
    let url = `${environment.apiUrl}/ams/api/head-accounts/getCoa?page=` + page + "&size=" + 20;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.get<any>(url, { headers: h });
  }
  public coaSingleData(sub: any, page: any) {
    let url = `${environment.apiUrl}/ams/api/leaf-accounts/getLeafBySubAcc?sub=` + sub + "&page=" + page + "&size=" + 20;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.get<any>(url, { headers: h });
  }
  //new
  public getAllChartAccountsLiabilitySubAccData(categoryValue: any, head: any, page: any) {
    // let url = `${environment.apiUrl}/ams/api/leaf-accounts/getByType?type=` + "LIABILITY" + "&page=" + page;
    let url = `${environment.apiUrl}/ams/api/sub-accounts/getByTypeByHead?type=` + "LIABILITY" + "&head=" + head + "&page=" + page;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.get<any>(url, { headers: h });
  }
  public getAllChartAccountsLiabilityLeafAccData(categoryValue: any, head: any, page: any) {
    // let url = `${environment.apiUrl}/ams/api/leaf-accounts/getByType?type=` + "LIABILITY" + "&page=" + page;
    let url = `${environment.apiUrl}/ams/api/leaf-accounts/getByTypeBySub?type=` + "LIABILITY" + "&sub=" + head + "&page=" + page;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.get<any>(url, { headers: h });
  }
  public getAllChartAccountsExpenseSubAccData(categoryValue: any, head: any, page: any) {
    let url = `${environment.apiUrl}/ams/api/sub-accounts/getByTypeByHead?type=` + "EXPENSE" + "&head=" + head + "&page=" + page;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.get<any>(url, { headers: h });
  }
  public getAllChartAccountsExpenseLeafAccData(categoryValue: any, head: any, page: any) {
    let url = `${environment.apiUrl}/ams/api/leaf-accounts/getByTypeBySub?type=` + "EXPENSE" + "&sub=" + head + "&page=" + page;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.get<any>(url, { headers: h });
  }
  public getAllChartAccountsIncomeSubAccData(categoryValue: any, head: any, page: any) {
    // let url = `${environment.apiUrl}/ams/api/leaf-accounts/getByType?type=` + "INCOME" + "&page=" + page;
    let url = `${environment.apiUrl}/ams/api/sub-accounts/getByTypeByHead?type=` + "INCOME" + "&head=" + head + "&page=" + page;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.get<any>(url, { headers: h });
  }
  public getAllChartAccountsIncomeLeafAccData(categoryValue: any, head: any, page: any) {
    let url = `${environment.apiUrl}/ams/api/leaf-accounts/getByTypeBySub?type=` + "INCOME" + "&sub=" + head + "&page=" + page;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.get<any>(url, { headers: h });
  }
  public getAllChartAccountsAssetSubAccData(categoryValue: any, head: any, page: any) {
    // let url = `${environment.apiUrl}/ams/api/leaf-accounts/getByType?type=` + "ASSET" + "&page=" + page;
    let url = `${environment.apiUrl}/ams/api/sub-accounts/getByTypeByHead?type=` + "ASSET" + "&head=" + head + "&page=" + page;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.get<any>(url, { headers: h });
  }
  public getAllChartAccountsAssetLeafAccData(categoryValue: any, head: any, page: any) {
    let url = `${environment.apiUrl}/ams/api/leaf-accounts/getByTypeBySub?type=` + "ASSET" + "&sub=" + head + "&page=" + page;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.get<any>(url, { headers: h });
  }
  public getDetails(accNo: any) {
    let url = `${environment.apiUrl}/ams/api/leaf-accounts/getUserByLeaf?leaf=` + accNo;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.get<any>(url, { headers: h });
  }
  public getTransactionHistory(walletNo: any) {
    let url = `${environment.apiUrl}/ams/api/leaf-accounts/getUserTransactionHistory?walletNo=` + walletNo;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.get<any>(url, { headers: h });
  }
  public filterByHeadAcc(id: any) {
    // let url = `${environment.apiUrl}/ams/api/leaf-accounts/getBySubAccNoWithoutFilter?name=` + name + "&page=" + page;
    let url = `${environment.apiUrl}/ams/api/head-accounts/getSubAccountByHeadWithBalance/` + id;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.get<any>(url, { headers: h });
  }
  public getAllHeadAccDefData() {
    let url = `${environment.apiUrl}/ams/api/head-accounts/getAllHeadAccNoWithBalance`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.get<any>(url, { headers: h });
  }
  public getLeafData(name: any, page: any) {
    let url = `${environment.apiUrl}/ams/api/leaf-accounts/getBySubAccNoWithoutFilterWithName?name=` + name + "&page=" + page;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.get<any>(url, { headers: h });
  }
  public getAllSubAccounts() {
    let url = `${environment.apiUrl}/ams/api/sub-accounts/all`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.get<any>(url, { headers: h });
  }
  public getAllLeafAccounts() {
    let url = `${environment.apiUrl}/ams/api/leaf-accounts`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.get<any>(url, { headers: h });
  }
  public getHundredFilteredTransaction() {
    let url = `${environment.apiUrl}/ts/api/transaction-services/getHundredFilteredTransaction`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.get<any>(url, { headers: h });
  }
  public getRefundTransactionReport(batchId: any) {
    let url = `${environment.apiUrl}/ts/api/transaction-services/GetAllByBatchId?batchId=` + batchId;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.get<any>(url, { headers: h });
  }
  public createLeafAccount(req: any) {
    let url = `${environment.apiUrl}/ams/api/leaf-accounts`;
    let h: HttpHeaders =
      this.getHeaders().set("Content-Type", "application/json");
    return this.httpClient.post<any>(url, req, { headers: h })
  }
  public getReverseData() {
    let url = `${environment.apiUrl}/ts/api/transaction-services/GetAllReversal`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.get<any>(url, { headers: h });
  }
  public ReverseRefundTransaction(batchId: any) {
    let url = `${environment.apiUrl}/ts/api/transaction-services/reversal?batchId=` + batchId;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.get<any>(url, { headers: h });
  }
  public AuthorizeRefundTransaction(batchId: any) {
    let url = `${environment.apiUrl}/ts/api/transaction-services/reversalAuthorize?value=` + batchId;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.get<any>(url, { headers: h });
  }
  public rejectRefundTransaction(batchId: any) {
    let url = `${environment.apiUrl}/ts/api/transaction-services/reversalReject?value=` + batchId;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.get<any>(url, { headers: h });
  }
  public getSubAccountByHeadId(headId: any) {
    let url = `${environment.apiUrl}/ams/api/head-accounts/getSubAccountByHead` + headId;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.get<any>(url, { headers: h });
  }
  createHead(req: any) {
    let url = `${environment.apiUrl}/ams/a`;
    let h: HttpHeaders = this.getHeaders().set(
      "Content-Type",
      "application/json"
    );
    console.log(url);
    return this.httpClient.post<any>(url, req, { headers: h });
  }
}
