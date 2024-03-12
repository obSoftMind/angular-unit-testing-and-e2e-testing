import { ComponentFixture, TestBed, fakeAsync, flush, tick, waitForAsync } from "@angular/core/testing"
import { HomeComponent } from "./home.component"
import { DebugElement } from "@angular/core"
import { CoursesModule } from "../courses.module";
import { CoursesService } from "../services/courses.service";
import { setupCourses } from "../common/setup-test-data";
import { of } from "rxjs";
import { By } from "@angular/platform-browser";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { click } from "../common/test-utils";

describe('HomeComponent', () => {

  let component : HomeComponent,
      fixture: ComponentFixture<HomeComponent>,
      el : DebugElement,
      coursesService : any

  const beginner = setupCourses().filter( (course) => course.category ==='BEGINNER');
  const advanced = setupCourses().filter( (course) => course.category ==='ADVANCED');
      

  beforeEach(
    waitForAsync(
      () => {

        const coursesServiceSpy = jasmine.createSpyObj('CoursesService',['findAllCourses']);

        TestBed.configureTestingModule({
          imports:[
            CoursesModule,NoopAnimationsModule
          ],
          providers: [
            {provide: CoursesService, useValue: coursesServiceSpy}
          ]
        })
        .compileComponents()

        .then( () => {

          fixture = TestBed.createComponent(HomeComponent);

          component= fixture.componentInstance;

          el = fixture.debugElement;

          coursesService = TestBed.inject(CoursesService);
        })

      }
    )
  )

  it('should create the component', () => {
    expect(component).toBeTruthy();
  })

  
  it('should display only  beginner courses', () => {

    coursesService.findAllCourses.and.returnValue( of(beginner));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css('.mdc-tab__text-label'));

    console.log('tabs', tabs);

    expect(tabs.length).toBe(1, "Unexpected number of tabs found");

    expect(tabs[0].nativeElement.innerText).toBe('Beginners')

  })

  it('should display only  advanced courses', () => {
    coursesService.findAllCourses.and.returnValue( of(advanced));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css('.mdc-tab__text-label'));

    
    expect(tabs.length).toBe(1, "Unexpected number of tabs found");
    
    // expect(tabs[0].nativeElement.text).toBe('Advanced')
  })

  it('should display both tabs', () => {
    coursesService.findAllCourses.and.returnValue( of(setupCourses()));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css('.mdc-tab__text-label'));

    
    expect(tabs.length).toBe(2, "Unexpected number of tabs found");
  })

  it('should display advanced course when tab clicked', fakeAsync(() => {

    coursesService.findAllCourses.and.returnValue( of(setupCourses()));

    fixture.detectChanges();

    const tabs = el.queryAll(By.css('.mdc-tab__text-label'));

    //tabs[1].nativeElement.click(); // dom api for native dom element

    click(tabs[1]);

    fixture.detectChanges();

    flush();

    const cardTitles = el.queryAll(By.css('.mat-mdc-card-title'));

    expect(cardTitles.length).toBeGreaterThan(0,'Could not find card titles');
    
    expect(cardTitles[0].nativeElement.textContent).toContain('Angular Testing Course');
    
  }))



})