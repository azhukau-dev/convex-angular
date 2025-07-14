import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'cva-convex-angular',
  imports: [CommonModule],
  templateUrl: './convex-angular.html',
  styleUrl: './convex-angular.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConvexAngular {}
