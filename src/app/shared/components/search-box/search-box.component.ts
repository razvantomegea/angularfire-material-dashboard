import { AfterContentInit, Component, EventEmitter, Input, NgZone, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';

import { NotificationService } from 'app/core/services';
import { ComponentDestroyed } from 'app/shared/mixins';
import { debounceTime, distinctUntilChanged, take, takeUntil } from 'app/shared/utils/rxjs-exports';

interface WindowInterface extends Window {
  SpeechRecognition: any;
  webkitSpeechRecognition: any;
}

@Component({
  selector: 'app-search-box',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.scss']
})
export class SearchBoxComponent extends ComponentDestroyed implements OnChanges, AfterContentInit {
  @Input() public flat: boolean;
  @Input() public placeholder: string;
  public searchInputCtrl: FormControl = new FormControl();
  @Input() public value: string;
  @Output() private readonly search: EventEmitter<string> = new EventEmitter();
  private speechRecognition: any;

  constructor(private ngZone: NgZone, private notificationService: NotificationService) {
    super();
  }

  public ngAfterContentInit(): void {
    this.searchInputCtrl.valueChanges.pipe(debounceTime(1000), distinctUntilChanged(), takeUntil(this.isDestroyed$))
      .subscribe((value: string) => {
        this.onSearch(value);
      });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.value) {
      this.searchInputCtrl.setValue(this.value);
    }
  }

  public onClear(): void {
    this.searchInputCtrl.setValue('');
    this.onSearch();
  }

  public onRecord(): void {
    this.notificationService.showNotificationDialog('Please say loud and clear what you want me to search for!', 'Voice search', true)
      .afterClosed()
      .pipe(take(1))
      .toPromise()
      .then((isConfirmed: boolean) => {
        if (isConfirmed) {
          this.ngZone.run(() => {
            this.speechRecognition = this.setupSpeechRecognition();
            this.speechRecognition.start();
          });
        }
      });
  }

  public onSearch(value?: string): void {
    this.search.emit(value || this.searchInputCtrl.value);
  }

  private onSpeechRecognitionEnd(): void {
    this.ngZone.run(() => {
      if (!this.searchInputCtrl.value) {
        this.notificationService.showError(`I didn't understand. Please repeat!`, 2000);
      }
    });
  }

  private onSpeechRecognitionResult(event): void {
    this.ngZone.run(() => {
      this.notificationService.showSuccess('Voice command understood!');
      this.speechRecognition.onend = null;

      if (event.results && event.results.length) {
        this.searchInputCtrl.setValue(event.results[0][0].transcript);
        this.onSearch();
      } else {
        this.notificationService.showError(`I didn't understand. Please repeat!`, 2000);
      }
    });
  }

  private setupSpeechRecognition(): any {
    const speechRecognition = Reflect.has(window, 'SpeechRecognition') ? (<WindowInterface>window).SpeechRecognition
      : (<WindowInterface>window).webkitSpeechRecognition;
    const recognition = new speechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-us';
    recognition.maxAlternatives = 1;
    recognition.onend = this.onSpeechRecognitionEnd.bind(this);
    recognition.onresult = this.onSpeechRecognitionResult.bind(this);

    return recognition;
  }
}
