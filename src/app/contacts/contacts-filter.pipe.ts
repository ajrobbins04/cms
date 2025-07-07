import { Pipe, PipeTransform } from '@angular/core';
import { Contact } from './contact.model';

@Pipe({
  name: 'contactsFilter'
})
export class ContactsFilterPipe implements PipeTransform {

  transform(contacts: Contact[], term: string): { name: string; members: Contact[] }[] {
    if (!contacts || contacts.length === 0) return [];

    const lowerTerm = term ? term.toLowerCase() : '';
    const departments = contacts.filter(c => c.isDept && c.group?.length);
    const individuals = contacts.filter(c => !c.isDept);

    // Try to match departments first
    const matchedDepts = departments.filter(dept =>
      dept.name.toLowerCase().includes(lowerTerm)
    );

    if (matchedDepts.length > 0) {
      // Filter members in any matched departments
      return matchedDepts.map(dept => ({
        name: dept.name,
        members: dept.group!.filter(member =>
          member.name.toLowerCase().includes(lowerTerm)
        )
      }));
    } else {
      // Otherwise, show all departments, with only matching members in each
      const matchedIndividuals = individuals.filter(ind =>
        ind.name.toLowerCase().includes(lowerTerm)
      );

      return departments.map(dept => ({
        name: dept.name,
        members: dept.group!.filter(member =>
          matchedIndividuals.some(ind => ind.id === member.id)
        )
      }));
    }
  }

}
