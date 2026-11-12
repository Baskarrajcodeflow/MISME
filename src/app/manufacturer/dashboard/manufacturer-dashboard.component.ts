import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CustomerApiService } from '../../user-management/user-management/user-management/bo/customer/ApiService/api.service';
import { PARTNER_SCREEN } from '../../user-management/organization/organization-screen';

interface PartnerCard {
  /** entityType value of the partners this card counts (see PARTNER_SCREEN.entityTypes). */
  type: string;
  label: string;
  /** Shown as the card's tooltip. */
  description: string;
  /** Path data of the card's 24x24 outline icon. */
  icon: string;
  /** Background of the card's icon circle. */
  tint: string;
  /** Colour of the icon itself (a darker shade of the tint). */
  tone: string;
}

/**
 * Manufacturer landing screen (PLATFORM_LOGIN.homePath): how many suppliers, merchants and
 * distributors the signed-in manufacturer has onboarded. A card opens the partner list filtered
 * to that type; the Onboard button opens the registration form.
 */
@Component({
  selector: 'app-manufacturer-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './manufacturer-dashboard.component.html',
  styleUrl: './manufacturer-dashboard.component.css',
})
export class ManufacturerDashboardComponent implements OnInit {
  readonly listPath = PARTNER_SCREEN.listPath;
  readonly registerPath = PARTNER_SCREEN.registerPath;

  readonly cards: PartnerCard[] = [
    {
      type: 'SUPPLIER',
      label: 'Suppliers',
      description: 'Businesses that supply your materials',
      icon: 'M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0',
      tint: '#ede9fe',
      tone: '#7c3aed',
    },
    {
      type: 'MERCHANT',
      label: 'Merchants',
      description: 'Shops that sell your products',
      icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
      tint: '#e0f2fe',
      tone: '#0284c7',
    },
    {
      type: 'DISTRIBUTOR',
      label: 'Distributors',
      description: 'Businesses that distribute your products',
      icon: 'M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z',
      tint: '#ffedd5',
      tone: '#ea580c',
    },
  ];

  /** Partners per entityType; null until the list has loaded. */
  counts: Record<string, number> | null = null;
  loadFailed = false;

  constructor(private apiService: CustomerApiService) {}

  ngOnInit(): void {
    this.loadCounts();
  }

  /**
   * Counts the partners returned by the list endpoint. That endpoint is paged, so once a
   * manufacturer can have more partners than one page, the backend should return the counts itself.
   */
  loadCounts(): void {
    this.loadFailed = false;
    this.apiService.getOrganizationDetails().subscribe({
      next: (res) => {
        if (res?.responseCode != 200) {
          this.loadFailed = true;
          return;
        }
        const counts: Record<string, number> = {};
        for (const partner of res?.data?.content ?? []) {
          counts[partner.entityType] = (counts[partner.entityType] ?? 0) + 1;
        }
        this.counts = counts;
      },
      error: () => {
        this.loadFailed = true;
      },
    });
  }

  /** The card's count, or a dash while the counts are loading or couldn't be loaded. */
  countOf(type: string): string {
    return this.counts ? String(this.counts[type] ?? 0) : '–';
  }
}
