import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-file-item',
  template: `
    <style>
      .file-item {
        margin: 12px 0;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .file-name {
        font-size: 14px;
        display: inline-block;
        margin-left: 16px;
      }

      .file-image {
        object-fit: cover;
      }
    </style>
    <div class="file-item">
      <img
        class="file-image"
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAclBMVEX///8AAABCQkL7+/v39/dPT0+mpqbGxsbs7OwXFxe2trbJycl3d3fU1NQvLy+jo6M7OzuPj4/j4+NJSUmFhYVvb29VVVVbW1tnZ2fX19dgYGDg4OAgICA8PDxiYmKTk5MoKCh+fn68vLwLCwucnJySkpJeWSrHAAAErUlEQVR4nO3d63KiQBSFURAiFyUqERM1idHJvP8rzkQdoa1Aw4HeRzP7+03RrECkikvjeYwxxhhjjLFbK87SsdMOWajpyzavvvNei7WWL1i4552a6uzHoEABfX+lQpzigL7/rEAcI4F/92KMBoZzrBB/oEb/Bk4jlz2WRPSBev4dnQZuh3nz1YinH9LE8X9HYPwvQA/UYHUcc+54TFMIJQYPxyFHGGGicKBihQ9LPBErfPLwRLQQT4QLS+IGQ8QL0XtRQQgmagixB6qKEErUESIPVCUhkKglLInvrofWEsL+F/WEKKKiEHSgagpL4ovDKwyqQshe1BVWiM72orIQcKBqCytER5ugLnRO1Be6PlBvQFgSCxfEWxC6PVBvQuj0QL0NocsDFST0TsN81A7jjogSnu+kL2sXuDxLMPSBWiPMZp+z1n3OJtatSv9t/6zucZTLvZspQNj92QXrtYj4V/uVpe6Fglv7O9tAv9uv623Qf5lvhavuwifbcRo+tF/ZxLnwvbtwZR0pH7Ve2cK5MLJswTeN7UOFL21XVjgXerOPbr6k3V99UrRb72rIE0bN2SLMOtX6OYd4O2kqOt8qBgiVCkY/XRhSKIhCbBRKohAbhZIoxEahJAqxUSiJQmwUSqIQG06YL0b1vT3tqlee8uVo3rB0U/PRItcR5raLfqOSuO33fu2HQYQJl03bdKy8ALzvBby63wYT2q+/l3fA+r6+OFIRdtmHfd+x1dmHW9vNvsfy/3DdD5hsVYTedvrY0HxZ/XlYF03LWpoaQJ4PRVGIjUJJFGKjUBKF2CiURCE2CiVRiI1CSf+rMEinRTF13d8hUtMCE4ZPPqqrgVHCTxjQ9z9VhLhdePUaDUwInEjRfOIZJsyAwkxF6EWrBNMqMsYFng+DGNMVhWd8SRRio1AShdgolEQhNgolUYiNQkkUYqNQ0hDzYlxPkmGsaT1uWjozh4UJg36P4xWVldkeAjTn84cJ+37yYnZZk33uAmOqApiwwxQW31Y+M7q3LvugIhTMi2H0fFmT/Rs97ypCwbwYRuUEM/anT43Libjf0q7zYhi9Vm9FpI+Ny37MjHGBZ4tw3W1ijErruP2a1tfD8owviEJsFEqiEBuFkijERqEkCrFRKIlCbBRKqhHGkyiKGidx7N/XCFdTSuKEuw6z/vbqlzk7L0x4APm+OqgIn4HC5+rAMKFgpmRxxgTEMGHatEkDZ0zejbszs4cB9zp3Zjxve0gRHcwJB3jGF0UhNgolUYiNQkkUYqNQEoXYKJREITYKJbkX5tu8vh/whmXU/F74m/mNtTsUbht9XxlPFN+hcGcVvlQXv0Ph3irUmXFguOz3B4zHL+9QaP1WpPlpyDsUet5kt6jv90Fp9ha1KJREITYKJVGIjUJJFGKjUBKF2CiURCE2CiUFp6f05jciPH15aNCvx5/nuUxy+5KA8uS4NYV9yQ6d3ycfdqXSztetFoOudHJaqb9JI+3SzXlbJvbN7lDY96Nbwzf0j0LfSTCGb2zf6G4h59Rt0/A/Cdbr0tiKQU8V5+zzc+Aa9nf0UrZJtGXHkk1m31hhcZaOtUuz2L6hjDHGGGOMMXB/AFbjgPStNOjZAAAAAElFTkSuQmCC"
        alt=""
        width="80"
      />
      <span class="file-name">file name</span>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class FileItemComponent {}
