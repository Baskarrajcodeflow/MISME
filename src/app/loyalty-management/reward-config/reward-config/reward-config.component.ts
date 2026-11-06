import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ApiServiceService } from "../../../product/api-service/api-service.service";

interface RewardConfig {
  name: string;
  minTransactionAmount: number | null;
  maxLimit: number;
  expiryDays: number;
  amountPerPoint: number;
  pointsPerTransaction: number | null;
}
@Component({
  selector: "app-reward-config",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./reward-config.component.html",
  styleUrl: "./reward-config.component.css",
})
export class RewardConfigComponent {
  activeTab: "cashback" | "topup" | "data" = "cashback";
  pointsPerTransaction: any;
  amountPerPoint: any;
  expiryDays: any;
  maxLimit: any;
  minAmount: any;
  loyaltyName: any;
  rewardConfigs: any = [];
  constructor(private apiService: ApiServiceService) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.loadConfig();
  }

  loadConfig() {
    this.apiService.getLoyatyConfig().subscribe({
      next: (config: any) => {
        this.rewardConfigs = config.data;
      },
      error: (error: any) => {
        console.error("Error loading configuration:", error);
      },
    });
  }

  saveConfig() {
    const newConfig: RewardConfig = {
      name: this.loyaltyName,
      minTransactionAmount: null,
      maxLimit: this.maxLimit,
      expiryDays: this.expiryDays,
      amountPerPoint: this.amountPerPoint,
      pointsPerTransaction: null,
    };

    console.log("New Reward Configuration:", newConfig);

    this.apiService.loyatyConfig(newConfig).subscribe({
      next: (response) => {
        if (response?.responseCode === 200) {
          alert("Configuration saved successfully!");
          this.loadConfig();
        } else {
          alert(response?.error);
        }
      },
      error: (error) => {
        console.error("Error saving configuration:", error);
      },
    });
  }

  approve(config: any) {
    let body = {
      configIds: [config.id],
      reason: "",
    };
    this.apiService.approveLoyatyConfig(body).subscribe({
      next: (res: any) => {
        if (res?.responseCode === 200) {
          alert(res?.data?.errors);
        } else {
          alert(res?.error);
        }
      },
      error: (err: any) => {
        console.error("Error approving configuration:", err);
      },
    });
  }
}
