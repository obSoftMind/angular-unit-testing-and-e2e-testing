describe('HomeComponent', ()=> {

    beforeEach(()=> {
        // we use cypress to mock our back-end
        // use the course.json to simulate an http response
        
        // I use as('Name of http response')
        cy.fixture('courses.json').as('coursesJson');

        // server that simulate mock http request
        cy.server();


        // when i reach the /api/courses : @coursesJson sended back
        // @: in order to access to the payload coursesJson
        cy.route('/api/courses', '@coursesJson').as('courses')
        
    })

    it('should display a list of courses', () => {

        // visite the route of our application:
        // localhost:4200
        cy.visit('/');

        // when the page is loaded, we confirm
        // that we are in the right page
        cy.contains('All Courses');

        // waite for the couses event to finish
        cy.wait('@courses');

        cy.get('mat-card').should('have.length', 9);
    })

    it('should display the advanced courses', () => {
       
        cy.get('.mat-mdc-tab-labels .mdc-tab__text-label').should('have.length',2);

        cy.get('.mat-mdc-tab-labels .mdc-tab__text-label').last().click();

        cy.get('.mat-mdc-tab-body-active .mat-mdc-card-title').its('length').should('be.gt', 1);

        cy.get('.mat-mdc-tab-body-active .mat-mdc-card-title').first().should('contain', 'Angular Security Course');
    })
})